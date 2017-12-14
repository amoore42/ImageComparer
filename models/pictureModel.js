var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pictureModel = new Schema({
    Uri:{
        type: String
    },
    Hash:{
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('Picture', pictureModel);