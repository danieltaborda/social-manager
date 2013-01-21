
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index',{email:req.session.email,privilege: req.session.privilege});
};

exports.partials = function (req, res) {
	// check session
  if (!req.session.email) {
    // if false render
    var name = req.params.name;
  	res.render('partials/login');
  } else {
    // if true redirect
    var name = req.params.name;
    if(name=="admin" && req.session.privilege != "admin"){
      res.render('partials/home');
    }else
  	{
      res.render('partials/' + name);
    }
  }
};