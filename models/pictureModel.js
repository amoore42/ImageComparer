var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pictureModel = new Schema({
    name:{
        type: String
    },
    image:{
        type: Array, 
        default: []
    }
});

module.exports = mongoose.model('Picture', pictureModel);