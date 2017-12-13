var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    AWS = require('aws-sdk');

var options = {
    useMongoClient: true,
};

var db = mongoose.connect('mongodb://localhost/PictureAPI', options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to mongodb');
});

AWS.config.update({
    accessKeyId: "BLANK",
    secretAccessKey: "BLANK"
});

var s3 = new AWS.S3();
var s3Params = {
    Bucket: 'twt-product-images-usstandard',
    Key: 'inspiration/587271d6bd966f1100025926.jpeg'
};

var Picture = require('./models/pictureModel');

var app = express();

var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

pictureRouter = require('./routes/pictureRoutes')(Picture);

app.use('/api/Picture', pictureRouter);

app.get('/', function(req, res){
    res.send('Welcome to my api');
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port)
});

/*var params = {};
s3.listBuckets(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});*/

var image = require('./Image');

s3.getObject(s3Params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else{
        
        image.saveImage('myfile.jpeg', data);
        console.log(data);           // successful response
    }     
});