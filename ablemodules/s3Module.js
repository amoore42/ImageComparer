var AWS = require('aws-sdk');

var accesskey = process.env.AccessKeyId;
var secretkey = process.env.SecretAccessKey;

AWS.config.update({
    accessKeyId: accesskey,
    secretAccessKey: secretkey
});

var S3 = function(){
    var JIMP = require('./jimpModule');
    var s3 = new AWS.S3();
    var s3Params = {
        Bucket: 'twt-product-images-usstandard',
    };

    function getImagePrivate( strId, callback ) {
        //string the id from the uri
        var id = strId.substring(strId.lastIndexOf("/")+1);
        s3Params['Key'] = 'inspiration/' + id;
        s3.getObject(s3Params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else{
                JIMP.getHashImage(data.Body, function(hash){
                    callback(hash);
                    console.log(hash);
                });
            }     
        });
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        getImage: getImagePrivate
    };
}();

module.exports = S3;