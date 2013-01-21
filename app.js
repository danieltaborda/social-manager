/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes/index'),
  auth = require('./routes/auth'),
  upload = require('./routes/api/upload'),
  collection = require('./routes/api/collection'),
  socket = require('./routes/socket.js');

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration------------------------------------///////////////////
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'wtvisionSecret'}));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
// Configuration------------------------------------///////////////////

// Routes--------------------------------------------///////////////////
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.post('/login', auth.login);
app.get('/logout', auth.logout);
//JSON API RESTFUL GENERIC
app.get('/api/collections/:collection', collection.findAll);
app.get('/api/collections/:collection/:id', collection.findById);
app.post('/api/collections/:collection', collection.add);
app.delete('/api/collections/:collection/:id', collection.delete);
//UPLOAD IMAGE
app.post('/api/upload/image',upload.image);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
// Routes --------------------------------------------///////////////////

// Socket.io Communication----------------------------///////////////////
io.sockets.on('connection', socket);
// Socket.io Communication----------------------------///////////////////

// Start server --------------------------------------///////////////////
server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
// Start server --------------------------------------///////////////////