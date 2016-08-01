CGC.service('user', function ($window, $rootScope, $http, socket) {
    angular.element($window).on('storage', function(event) {
    if (event.key === 'userStorage') {
      $rootScope.$apply();
    }
    });
    var req = {
     method: 'POST',
     url: '/user/getCurrentUser'
    };
    $http(req).success(function(response){
        this.current_user = response;
        // Save user email in the socket
        socket.emit('save user', response.email);
        socket.emit('get all users');
        $window.localStorage.setItem('userStorage', JSON.stringify(this.current_user));
    });
    this.getUser = function() {
      return JSON.parse($window.localStorage.getItem('userStorage'));
    }
});