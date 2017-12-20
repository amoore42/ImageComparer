var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Schema.plugin(require('mongoose-paging'));

//mongoose.Schema.plugin(require('mongoose-paging'));

var pictureModel = new Schema({
    UserName:{
      type: String  
    },
    Uri:{
        type: String
    },
    Hash:{
        type: String,
        default: '',
    }
});

pictureModel.plugin(require('mongoose-paging'));

module.exports = mongoose.model('Picture', pictureModel);