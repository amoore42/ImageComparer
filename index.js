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

var Picture = require('./models/pictureModel');

var app = express();

var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var pictureRouter = require('./routes/pictureRoutes')(Picture);

app.use('/api/Picture', pictureRouter);

app.get('/', function(req, res){
    res.send('Welcome to my api');
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port)
});

//var S3 = require('./ablemodules/S3Module');
//S3.getImage("587271d6bd966f1100025926.jpeg");