var CGC = angular.module('CGC', []);

CGC.controller('UserCtrl', ['$scope', '$http','$window', function ($scope, $http, $window) {
	console.log("Hello World from angular controller");
	$scope.name ='Lagnesh';
	$scope.followUser = function(id,user_id){
		console.log("Follow User function");
		var req = {
				 method: 'POST',
				 url: '/user/follow',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: { id: id, user_id: user_id }
				}
		$http(req).success(function(response){
			console.log(response);	
			$window.location.reload();
		}).error(function(response){
			console.log(response);
		});
	}
	
}]);

CGC.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});