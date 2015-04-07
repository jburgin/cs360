angular.module('clusterApp', [])
.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.cluster = [{pid:1234}];
  } 
]);
$scope.getPIDs = function() {
  $scope.cluster = [{pid:12},{pid:34}];
}
 