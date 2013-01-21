var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
//get dataNanagerDb name by config... later
var server = new Server('localhost', 27017);
db = new Db('dataManagerDb', server,{safe:false});

//temphere move to separate file
var sys = require('sys'), 
hash = require('node_hash');
function getHash(password)
{ 
  var salt = "sUp3rS3CRiT$@lt"; //temp change later by unique per user
  var salted_md5 = hash.md5(password, salt);
  return salted_md5;
}

db.open(function(err, db) {

    if(!err) {
        console.log("Connected to 'dataManagerDb' database");
        db.collection('programs', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'programs' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findAll = function(req, res){
    var myCollection = req.params.collection;
    db.collection(myCollection, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
exports.findById = function(req, res) {
    var myCollection = req.params.collection;
    var id = req.params.id;
    console.log('Retrieving ' + myCollection + ': ' + id);
    db.collection(myCollection, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
exports.add = function(req, res) {
    var myCollection = req.params.collection;
    var data = JSON.parse(JSON.stringify(req.body));
    if(data[0].password)
    {
        data[0].password = getHash(data[0].password);
    }
    data[0].log = [{"date_inserted" : new Date(), "_id_user":new BSON.ObjectID(req.session.user_id)},{"date_update" : '', "_id_user":''}];
    console.log('Adding '+ myCollection + ': '+ JSON.stringify(data));
    db.collection(myCollection, function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(JSON.stringify(result[0]));
            }
        });
    });
}
exports.delete = function(req, res) {
    var id = req.params.id;
    var myCollection = req.params.collection;
    console.log('Deleting ' + myCollection + ': ' + id);
    db.collection(myCollection, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}