angular.module('clusterApp', [])
.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.cluster = [{pid:1234}];
  } 
]);   