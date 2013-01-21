'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/home/', {templateUrl: 'partials/home', controller: MainCtrl});
    $routeProvider.when('/tweets/:id', {templateUrl: 'partials/tweets', controller: MainCtrl});
    $routeProvider.when('/login/', {templateUrl: 'partials/login', controller: MainCtrl});
    $routeProvider.when('/admin/', {templateUrl: 'partials/admin', controller: MainCtrl});
    $routeProvider.when('/admin/config/', {templateUrl: 'partials/admin-config', controller: CollectionCtrl});
    $routeProvider.otherwise({redirectTo: '/home/'});
    $locationProvider.html5Mode(true);
  }]);