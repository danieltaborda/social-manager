
var fs = require('fs'),
util = require('util');

exports.image = function(req, res, next){
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/img-public/' + req.files.thumbnail.name;

    var is = fs.createReadStream(tmp_path)
    var os = fs.createWriteStream(target_path);

    is.pipe(os, function(err) {
        if (err) throw err;
        fs.unlinkSync(tmp_path);
    });
     res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
};