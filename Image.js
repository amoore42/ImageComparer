module.exports = {
    saveImage: function(filename, data){
        var fs = require('fs');
        var myBuffer = new Buffer(data.length);
        for (var i = 0; i < data.length; i++) {
            myBuffer[i] = data[i];
        }
        fs.writeFile("./" + filename, myBuffer, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
};
