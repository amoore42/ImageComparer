var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pictureModel = new Schema({
    Uri:{
        type: String
    },
    Hash:{
        type: String
    }
});

module.exports = mongoose.model('Picture', pictureModel);