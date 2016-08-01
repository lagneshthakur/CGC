CGC.factory('socket', function($rootScope) {
	var socketObject = {};   
	var socket = io('http://localhost:3000/');
	socketObject.on = function (eventName, callback) {
	  socket.on(eventName, function () {  
	    var args = arguments;
	    $rootScope.$apply(function () {
	      callback.apply(socket, args);
	    });
	  });
	};

	socketObject.emit = function (eventName, data, callback) {
	  socket.emit(eventName, data, function () {
	    var args = arguments;
	    $rootScope.$apply(function () {
	      if (callback) {
	        callback.apply(socket, args);
	      }
	    });
	  })
	}
	   return socketObject;
}); 