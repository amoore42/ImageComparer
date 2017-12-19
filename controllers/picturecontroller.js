var pictureController = function(Picture, S3, dataLoader){
    var post = function(req, res){
        //We want to get the image from s3 and then create an image hash
        var returnValues = new Array();
        var postedPicture = new Picture(req.body);
        S3.getImage(postedPicture.Uri, function(hash){
            var picture = new Picture();
            picture.Uri = req.body.Uri;
            picture.Hash = hash;
            picture.UserName = postedPicture.UserName;

            //Find the hash in the vpTree and close matches
            var maximumDistance = 0;
            var matches = dataLoader.getMatches(hash, maximumDistance);

            //Nothing was found
            if(matches.length == 0){
                picture.save(function(err){
                    if(!err){
                        //reload the tree.  There is no method to just insert a record *yet
                        dataLoader.loadAllPictures();
                    }
                });
                returnValues.push(picture);
                res.json(returnValues);
            }else{

                //If an exact match is not in the db then add it 
                var index = matches.indexOf(hash);
                if(index == -1){
                    returnValues.push(picture);
                    picture.save(function(err){
                        if(!err)
                            dataLoader.loadAllPictures();
                    });
                }

                Picture.find({
                    'Hash': { $in: matches }
                }, function(err, docs){
                     for(var i = 0; i < docs.length; ++i){
                        returnValues.push(docs[i]);
                     }
                     res.json(returnValues);
                });
            }
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