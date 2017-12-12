var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var options = {
    useMongoClient: true,
    //autoIndex: false, // Don't build indexes
    //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    //reconnectInterval: 500, // Reconnect every 500ms
    //poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    //bufferMaxEntries: 0
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

pictureRouter = require('./routes/pictureRoutes')(Picture);

app.use('/api/Picture', pictureRouter);

app.get('/', function(req, res){
    res.send('Welcome to my api');
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port)
});