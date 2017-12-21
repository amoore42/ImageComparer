var vpTree = require('vptree');
var leven = require('../functions/levenshtein');
var Picture = require('../models/pictureModel');

var dataManager = function(postedPicture){

    var CACHE_MAX_LENGTH = 100;
    var HASH_DISTANCE = 0;
    var vpTreeData = "";
    //The tree has to be rebuilt for each new element added.  Let's have an array to help augment the data
    var preTreeArray = new Array();
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
        var matches = this.getMatches(hash);

        //Nothing was found
        if(matches.length == 0){
            picture.save(function(err, saved){
                if(!err){
                    //reload the tree.  There is no method to just insert a record *yet
                    cachePicture(saved.Hash);
                }
            });
            returnValues.push(picture);
            callback(returnValues);
        }else{

            //If an exact match is not in the db then add it 
            var index = matches.indexOf(hash);
            if(index == -1){
                returnValues.push(picture);
                picture.save(function(err, saved){
                    if(!err){
                        cachePicture(saved.Hash);
                    }
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
            for(var i = 0; i < results.length; ++i)
                allResults.push(results[i].Hash);
            return Promise.resolve();
        }).then(function(){
            //Looks like we have to re-create the tree each time a new picture is
            //added.  There is no insert method.
            vpTreeData = vpTree.build(allResults, leven.getEditDistance, 0);
        });
    };

    var getMatches = function(hash){
        //The two signifies the number of closest elements.  5 is the distance/tolerance
        var searchResult = vpTreeData.search(hash, 2, 5);
        var result = new Array();

        for(var i = 0; i < searchResult.length; ++i){
            if(searchResult[i].d <= HASH_DISTANCE){
                result.push(vpTreeData.S[searchResult[i].i]);
            }
        }

        //Now let's search items in the array and add them as well. Searching this list will be much lower than the tree so
        //we need to keep the length small.
        for(var i = 0; i < preTreeArray.length; ++i){
            var distance = leven.getEditDistance(hash, preTreeArray[i]);
            if(distance <= HASH_DISTANCE)
                result.push(preTreeArray[i]);
        }
        
        return result;
    };

    //When adding new pictures we don't want to load the tree every time.  Instead an array is kept locally
    //and used to search over.  Because the length is limited the search won't be slow.  However the tree is
    //used to search the rest of the items.
    var cachePicture = function(hash){
        if(preTreeArray.length <= CACHE_MAX_LENGTH)
            preTreeArray.push(hash);
        else{
            preTreeArray.length = 0;
            loadAllPictures();
        }
    }

    return {
        setPostedPicture: setPostedPicture,
        saveData: saveData,
        loadAllPictures: loadAllPictures,
        getMatches: getMatches
    };
}();

module.exports = dataManager;

