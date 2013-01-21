'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', ['ngResource']).
	value('version', '0.1b').
    factory('Collection', function($resource){
  return $resource('api/collections/:collection/:id', {}, {});
}).factory('Twitter', function($resource){
  return $resource('http://search.twitter.com/:action',
        {action:'search.json', q:'angularjs', callback:'JSON_CALLBACK'},
        {get:{method:'JSONP'}});
}).factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});