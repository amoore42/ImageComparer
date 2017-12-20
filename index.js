var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
    AWS = require('aws-sdk'),
    dotenv = require('dotenv').config();

var options = {
    useMongoClient: true,
};

var db = mongoose.connect(process.env.MongoDB, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to mongodb');
});

var Picture = require('./models/pictureModel');

var app = express();

var port = process.env.port || 3000;

var dataManager = require('./Managers/dataManager');
dataManager.loadAllPictures();

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