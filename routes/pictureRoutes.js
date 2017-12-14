var express = require('express');
var S3 = require('../ablemodules/S3Module');

var routes = function(Picture){
    var pictureRouter = express.Router();
    
    pictureRouter.route('/')
        .post(function(req, res){
            //We want to get the image from s3 and then create an image hash
            //var uri = req.body.uri;
            var picture = new Picture(req.body);
            S3.getImage(picture.Uri, function(hash){
                var picture = new Picture();
                picture.Uri = req.body.Uri;
                picture.Hash = hash;

                //Now we need to check the mongodb to see if any image hashes are close
                var query = {};
                query.Hash = hash;
                Picture.findOne(query, function(err, mongoPicture){
                    if(err)
                        res.status(500).send(err);
                    else{
                        if(mongoPicture === null){
                            picture.save();
                            res.json(picture);
                        }
                        else{
                            res.status(401).send("Picture already exists in the db");
                            console.log("Picture already exists in the db");
                        }
                    }
                });
            });

            res.status(201);
        })
        .get(function(req, res){
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
    );
    
    pictureRouter.route('/Picture/:pictureId')
        .get(function(req, res){
            Picture.findById(req.params.pictureId, function(err, picture){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(picture);
            });
        }
    );

    return pictureRouter;
};

module.exports = routes;