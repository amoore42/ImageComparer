var JIMP = require("jimp");

var jmp = function(){

    function getHashImagePrivate( imageArray, callback ) {

        JIMP.read(imageArray, function(err, lenna){
            if (err) throw err;
            var hash = lenna.hash();
            callback(hash);
        });
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        getHashImage: getHashImagePrivate
    };
}();

module.exports = jmp;