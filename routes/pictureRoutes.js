var express = require('express');
var S3 = require('../ablemodules/S3Module');
var mongoose = require('mongoose');
var Picture = require('../models/pictureModel');
var dataManager = require('../Managers/dataManager');

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
    var pictureController = require('../Controllers/pictureController')(Picture, S3, dataManager);
    
    pictureRouter.route('/')
        .post(pictureController.post)
        .get(pictureController.get)
    
    pictureRouter.use('/:pictureId', pictureController.use)
    pictureRouter.route('/:pictureId')
        .get(pictureController.getpicturebyid)
        .put(pictureController.putsinglepicture)
        .patch(pictureController.patchsinglepicture)
        .delete(pictureController.deletepicture)

    return pictureRouter;
};

module.exports = routes;