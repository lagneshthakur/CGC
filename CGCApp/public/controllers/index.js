CGC.controller('IndexCtrl', ['$scope', '$http', 'socket', 'user' ,function ($scope, $http, socket,user) {
	console.log("Index controller");
    $scope.sendMessage = function (){
      $scope.current_user = user.getUser();
      var msg = $('#m').val();
      socket.emit('chat message', {msg:msg,user:$scope.current_user} );
      $('#m').val('');
    };
    
    socket.on('broadcast message', function(data){
        $('#messages').append($('<li>').html( data.user.name.first+" : "+data.msg));
      });
	
}]);