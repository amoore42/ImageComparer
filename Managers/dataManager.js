var vpTree = require('vptree');
var leven = require('../functions/levenshtein');
var Picture = require('../models/pictureModel');

var dataManager = function(postedPicture){

    var vpTreeData = "";
    var postedPicture;

    var setPostedPicture = function(postedPicture){
        this.postedPicture = postedPicture;
    };

    var saveData = function(hash, callback){
        var returnValues = new Array();
        var picture = new Picture();
        picture.Uri = this.postedPicture.Uri;
        picture.Hash = hash;
        picture.UserName = this.postedPicture.UserName;

        //Find the hash in the vpTree and close matches
        var maximumDistance = 0;
        var matches = this.getMatches(hash, maximumDistance);

        //Nothing was found
        if(matches.length == 0){
            picture.save(function(err){
                if(!err){
                    //reload the tree.  There is no method to just insert a record *yet
                    loadAllPictures();
                }
            });
            returnValues.push(picture);
            callback(returnValues);
        }else{

            //If an exact match is not in the db then add it 
            var index = matches.indexOf(hash);
            if(index == -1){
                returnValues.push(picture);
                picture.save(function(err){
                    if(!err)
                        loadAllPictures();
                });
            }

            Picture.find({
                'Hash': { $in: matches }
            }, function(err, docs){
                 for(var i = 0; i < docs.length; ++i){
                    returnValues.push(docs[i]);
                 }
                 callback(returnValues);
            });
        }
    };

    var loadAllPictures = function(){

        var stepValue = 100;
        var allResults = new Array();
        Picture.findPaged({}, 'Hash', {step: stepValue}, function(results){
            for(var i = 0; i < stepValue; ++i)
                allResults.push(results[i].Hash);
            return Promise.resolve();
        }).then(function(){
            //Looks like we have to re-create the tree each time a new picture is
            //added.  There is no insert method.
            vpTreeData = vpTree.build(allResults, leven.getEditDistance, 0);
        });
    };

    var getMatches = function(hash, maximumDistance){
        //The two signifies the number of closest elements.  5 is the distance/tolerance
        var searchResult = vpTreeData.search(hash, 2, 5);
        var result = new Array();

        for(var i = 0; i < searchResult.length; ++i){
            if(searchResult[i].d <= maximumDistance){
                result.push(vpTreeData.S[searchResult[i].i]);
            }
        }
        
        return result;
    };

    return {
        setPostedPicture: setPostedPicture,
        saveData: saveData,
        loadAllPictures: loadAllPictures,
        getMatches: getMatches
    };
}();

module.exports = dataManager;

