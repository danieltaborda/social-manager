'use strict';

/* Controllers */
function MainCtrl($scope, $location, $route,$http, Twitter) {
  var activePath = null;
  $scope.$on('$routeChangeSuccess', function(){
    activePath = $location.path();
    $scope.activePath = activePath;
  });
  $scope.isActive = function( pattern ) {
    return (new RegExp( pattern )).test( activePath );
  };
  $scope.tweets = Twitter.get({q:'%40twitterapi'});
}

function socketCtrl($scope,socket)
{
  $scope.messages = [];

   socket.on('send:name', function (data) {
    $scope.name = data.name;
  });
  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
  socket.on('send:tweets', function (data) {
    $scope.newTweets = data.newTweets;
  });

  socket.on('send:message', function (message) {
    console.log(message);
    $scope.messages.push(message);
  });

  //emit sockets
  
  $scope.sendMessage = function (sessionUser) {
    var user = (sessionUser) ? sessionUser : "Anonymous";
    if($scope.form.message.$valid)
      {socket.emit('send:message', {
            message: $scope.message,
            user : user
          });
          
          // add the message to our model locally
          $scope.messages.push({
            user: user,
            text: $scope.message
          });
          
          // clear message box
          $scope.message = '';
        };}
}
socketCtrl.$inject = ['$scope', 'socket'];

function CollectionCtrl($scope, $filter, Collection) {

  $scope.adminFormCollections = [
    {
      name:"programs",img:'/img/modules/program.png',
      form:[{type:"input-text", name:"name"},{type:"input-text", name:"hashtag"}]
    },
    {
      name:"users",img:'/img/modules/user.png',actions:['add'],
      form:[{type:"input-email", name:"email"},{type:"input-password", name:"password"},
      {type:"input-list", name:"privilege", options:[{id:'0',name:'admin'},{id:'1',name:'red_only'}]}]
    },
  ]
  
  $scope.collections = {};
  $scope.data = {};
  $scope.log =  $scope.data;

  $scope.reset = function(){
    $scope.result = "";
  }

  $scope.getList = function(collection){
    $scope.collections = Collection.query({collection:collection});
  } 
  $scope.delete = function(collection,id, index)
  {
    this.collections.splice(index, 1);
    $scope.isHidden = id;
    $scope.result = Collection.delete({collection:collection, id:id});
  }
  $scope.add = function(collection,data) { 
    $scope.data= angular.copy(data);
    $scope.log =  $scope.data;
    data = $filter('json')([data]);
    var result = Collection.save({collection:collection},data,function (data) { 
      $scope.validInsert = true;  //success
      $scope.result = "Inserted Success at "+ $filter('date')(new Date(),'h:mm:ss a');
      $scope.data={};
      $scope.success = "label-success";
    },
    function (data) {
        $scope.validInsert = false;  //failure
        $scope.result = 'Error on Insert';
        $scope.success = "label-important";
    });
  };
}