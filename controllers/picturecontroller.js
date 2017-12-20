var pictureController = function(Picture, S3, dataManager){
    var post = function(req, res){

        if(!req.body.UserName){
            res.status(400);
            res.send('UserName is required');
        }

        //We want to get the image from s3 and then create an image hash
        var postedPicture = new Picture(req.body);

        dataManager.setPostedPicture(postedPicture);

        S3.getImage(postedPicture.Uri, function(hash){
            dataManager.saveData(hash, function(returnValues){
                res.status(201);
                res.json(returnValues);
            })
        });
    }

    var get = function(req, res){
        var query = {};

        if (req.query.name){
            query.name = req.query.name;
        }

        Picture.find(query, function(err, picture){
            if(err)
                res.status(500).send(err);
            else
                res.json(picture);
        });
    }

    var use = function(req, res, next){
        Picture.findById(req.params.pictureId, function(err, picture){
            if(err)
                res.status(500).send(err);
            else if(picture){
                req.picture = picture;
                next();
            }else{
                res.status(404).send('picture not found');
            }
        });
    }

    var getpicturebyid = function(req, res){
        res.json(req.picture);
    }

    var putsinglepicture = function(req, res){
        req.picture.Uri = req.body.Uri;
        req.picture.UserName = req.body.UserName;
        req.picture.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(req.picture);
            }
        });
    }

    var patchsinglepicture = function(req, res){
        if(req.body._id)
            delete req.body._id;
        for(var p in req.body){
            if(p){
                req.pictre[p] = req.body[p];
            }
        }
        req.picture.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.json(req.picture);
            }
        });
    }

    var deletepicture = function(req, res){
        req.picture.remove(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(204).send('removed');
            }
        });
    }

    return{
        post: post,
        get: get,
        use: use,
        getpicturebyid: getpicturebyid,
        putsinglepicture: putsinglepicture,
        patchsinglepicture: patchsinglepicture,
        deletepicture: deletepicture
    }
}

module.exports = pictureController;