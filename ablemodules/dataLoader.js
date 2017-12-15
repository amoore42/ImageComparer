var Picture = require('../models/pictureModel');
var vpTree = require('vptree');
var leven = require('../functions/levenshtein');

function ResultSet( hash, values ) {
     this.hash = hash;
     this.values = values;
}

var dataLoader = {

    vpTreeData : "",

    loadAllPictures: function(callback){
        Picture.find(function(err, picture){
            if(err)
               console.log('error getting pictures');
            else{
                var hasharray = new Array();
                for(var i = 0; i < picture.length; i++){
                    hasharray.push(picture[i].Hash);
                }
                //Looks like we have to re-create the tree each time a new picture is
                //added.  There is no insert method.
                vptreehash = vpTree.build(hasharray, leven.getEditDistance, 0);
                vpTreeData = vptreehash;
                
                //Convert json picture data into array of pictures
                console.log(picture);
            }
        });
    },
    getMatches: function(hash, maximumDistance){
        //The two signifies the number of closest elements.  5 is the distance/tolerance
        var searchResult = vptreehash.search(hash, 2, 5);
        var result = new Array();

        for(var i = 0; i < searchResult.length; ++i){
            result.push(vptreehash.S[i]);
        }
        
        return result;
    }
};

module.exports = dataLoader;