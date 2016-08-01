CGC.controller('GlobalCtrl', ['$scope', '$http', '$rootScope','socket','user', function ($scope, $http, $rootScope, socket, user) {

    socket.on('followed', function(data){
        $('.notifications-wrapper').append('<a><div class="notification-item">\
                    <h4 class="item-title"></h4>\
                    <p class="item-info">'+data.follower_email+' followed '+ data.followee_email +' </p>\
                  </div></a>');
      });

}]);