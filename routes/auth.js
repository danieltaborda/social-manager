
/*
 * GET POST authorizaion page.
 */

//temphere move to separate file
var sys = require('sys'), 
hash = require('node_hash');
function getHash(password)
{ 
  var salt = "sUp3rS3CRiT$@lt"; //temp change later by unique per user
  var salted_md5 = hash.md5(password, salt);
  return salted_md5;
}

exports.login = function(req, res){
  var accounts = [];
	var mongodb = require('mongodb');
    var server = new mongodb.Server("127.0.0.1", 27017, {});
    new mongodb.Db('dataManagerDb', server, {safe:true}).open(function (error, client) {
      if (error) throw error;
      var collection = new mongodb.Collection(client, 'users');
      collection.find({}, {limit:10}).toArray(function(err, docs) {
        accounts = docs;
        var valid = false;
        // check the username && password
        var hashPassword = getHash(req.body.password);
        for (var i in accounts) {
          //console.log(accounts[i].email +'=='+ req.body.email +'&& Password: '+ accounts[i].password +'=='+ hashPassword);
          if (accounts[i].email == req.body.email && accounts[i].password == hashPassword) { 
            req.session.email = req.body.email;
            req.session.user_id = accounts[i]._id;
            req.session.privilege = accounts[i].privilege.name;
            valid = true;
            res.redirect('/home/');
          }       
        }
        if (!valid) res.redirect('/home/?err=1');
      });

    });
};
exports.logout = function(req, res){
// destroy session
  if (req.session.email) {
    req.session.destroy();
  }
  res.redirect('/');
};
