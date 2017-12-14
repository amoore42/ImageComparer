var express = require('express');
var S3 = require('../ablemodules/S3Module');
var dataLoader = require("../ablemodules/dataLoader");

var routes = function(Picture){
    var pictureRouter = express.Router();
    
    pictureRouter.route('/')
        .post(function(req, res){
            //We want to get the image from s3 and then create an image hash
            var returnValues = new Array();
            var postedPicture = new Picture(req.body);
            S3.getImage(postedPicture.Uri, function(hash){
                var picture = new Picture();
                picture.Uri = req.body.Uri;
                picture.Hash = hash;
                picture.UserName = postedPicture.UserName;

                //Find the hash in the vpTree and close matches
                var maximumDistance = 2;
                var matches = dataLoader.getMatches(hash, maximumDistance);

                //Nothing was found
                if(matches.values.length == 0 && matches.hash == null){
                    picture.save();
                    returnValues.push(picture);
                    res.json(returnValues);
                }else{
                    //check for exact match first - if there is an exact match just return
                    //what was passed in.  Don't save it though
                    if(matches.hash != null){
                        returnValues.push(picture);
                        var query = {};
                        query.Hash = matches.hash;
                        Picture.findOne(query, function(err, mongoPicture){
                            if(err)
                                res.status(500).send(err);
                            else{
                                //Fill in the details returned from mongo
                                returnPicture.UserName = mongoPicture.UserName;
                                returnPicture.Uri = mongoPicture.Uri;
                                returnValues.push(returnPicture);
                                if(matches.values.length <= 0)
                                    res.json(returnValues);
                            }
                        });
                    }
                    
                    //Get data from mongo for the other close matches
                    for(var i = 0; i < matches.values.length; ++i){
                        var closeMatch = matches.values[i];
                        var returnPicture = new Picture();
                        returnPicture.Hash = closeMatch;

                        var query = {};
                        query.Hash = closeMatch;
                        Picture.findOne(query, function(err, mongoPicture){
                            if(err)
                                res.status(500).send(err);
                            else{
                                //Fill in the details returned from mongo
                                returnPicture.UserName = mongoPicture.UserName;
                                returnPicture.Uri = mongoPicture.Uri;
                                returnValues.push(returnPicture);
                                res.json(returnValues);
                            }
                        });
                    }
                }
            });
            
            res.json(returnValues);
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