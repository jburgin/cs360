angular.module('weatherNews', [])
.controller('MainCtrl', [
  '$scope',
  function($scope){
    $scope.test = 'Hello world!';
	$scope.posts = [
      'Post 1',
      'Post 2',
      'Post 3',
      'Post 4',
      'Post 5'
    ];
  }
]);