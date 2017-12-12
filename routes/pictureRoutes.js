var express = require('express');

var routes = function(Picture){
    var pictureRouter = express.Router();
    
    pictureRouter.route('/')
        .post(function(req, res){
            var picture = new Picture(req.body);
            picture.save();
            res.status(201).send(picture);
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