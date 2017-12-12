var express = require('express');

var app = express();
var port = process.env.port || 3000;

app.get('/', function(req, res){
    res.send('Welcome to my api');
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port)
});