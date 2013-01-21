/*
 * Serve content over a socket
 */
var request = require('request');
var options = { }


module.exports = function (socket) {
  
  /*socket.emit('send:name', {
    name: ''
  });*/

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);

  setInterval(function () {
  	var result = "";
	request('http://search.twitter.com/search.json?q=%40twitterapi', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
      var lengthTweets = JSON.parse(body).results.length;
	    socket.emit('send:tweets', {
     		newTweets: lengthTweets
   		 });
	  }
	})
    
  }, 5000);

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      text: data.message,
      user: data.user
    });
  });

};
