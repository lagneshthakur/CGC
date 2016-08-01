CGC.controller('UserCtrl', ['$scope', '$http', '$rootScope','socket','user', function ($scope, $http, $rootScope, socket, user) {
	console.log("Hello from angular UserCtrl");
	$scope.search_user ='';
	$scope.email = "";
  	$scope.sendFollowMessage = function(id,user_id, follower_email, followee_email){
		var data = {id:id,user_id:user_id, follower_email:follower_email, followee_email:followee_email}
		socket.emit('follow', data);
		return false;
    };
	$scope.searchUser = function(){
		console.log("Search User function");
		$scope.current_user = user.getUser();
		var req = {
				 method: 'POST',
				 url: '/user/search',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: { email: $scope.email }
				}
				debugger
		$http(req).success(function(response){
			if(response.user){
				$scope.search_user = response.user;
				$scope.dob = response.dob;
				$rootScope.error_msg = '';
				$rootScope.success_msg = 'User Found';
			}
			else{
				$rootScope.error_msg = 'No user with that Email';
				$rootScope.success_msg = '';
			}
		}).error(function(response){
			console.log(response);
		});
	}

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
			if(response.user){
				$scope.search_user = response.user;
				$scope.dob = response.dob;
				$rootScope.error_msg = '';
				$rootScope.success_msg = 'Successfully Followed';
				$scope.sendFollowMessage(id,user_id,$scope.current_user.email,response.user.email);
			}
			else{
				$rootScope.error_msg = 'Already Following';
				$rootScope.success_msg = '';
			}
		}).error(function(response){
			console.log(response);
		});
	}

	$scope.unfollowUser = function(id,user_id){
		console.log("Unfollow User function");
		var req = {
				 method: 'DELETE',
				 url: '/user/follow',
				 headers: {
				   'Content-Type': 'application/json'
				 },
				 data: { id: id, user_id: user_id }
				}
		$http(req).success(function(response){
			if(response.user){
				$scope.search_user = response.user;
				$scope.dob = response.dob;
				$rootScope.error_msg = '';
				$rootScope.success_msg = 'Successfully unfollowed';	
			}
			else{
				$rootScope.error_msg = 'Already not following';
				$rootScope.success_msg = '';
			}
		}).error(function(response){
			console.log(response);
		});
	}
	
}]);