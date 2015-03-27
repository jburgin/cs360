angular.module('weatherNews', ['ui.router'])
.factory('postFactory', [function() {
	var o = {
		posts: [{title:'test', upvotes:15}]
	};
	return o;
}])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});
		$urlRouterProvider.otherwise('home');
	}]);
.controller('MainCtrl', [
  '$scope',
  'postFactory',
  function($scope, postFactory){
    $scope.test = 'Hello world!';
    $scope.posts = postFactory.posts;
	$scope.addPost = function() {
		$scope.posts.push({title:$scope.formContent, upvotes:0});
		$scope.formContent='';
	};
	$scope.incrementUpvotes = function(post) {
		post.upvotes += 1;
	};
  }
]);