var Picture = require('../models/pictureModel');
var vpTree = require('vptree');
var leven = require('../functions/levenshtein');

var dataLoader = {

    loadAllPictures: function(){
        Picture.find(function(err, picture){
            if(err)
               console.log('error getting pictures');
            else{
                var hasharray = new Array();
                for(var i = 0; i < picture.length; i++){
                    hasharray.push(picture[i].Hash);
                }
                vptreehash = vpTree.build(hasharray, leven.getEditDistance, 0);
                var result = vptreehash.search("dyg42j0284w", 2);
                
                //Convert json picture data into array of pictures
                console.log(picture);
            }
        });
    }
};

module.exports = dataLoader;