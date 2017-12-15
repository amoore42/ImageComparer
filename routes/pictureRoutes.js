var express = require('express');
var S3 = require('../ablemodules/S3Module');
var dataLoader = require("../ablemodules/dataLoader");
var mongoose = require('mongoose');
var Picture = require('../models/pictureModel');

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

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