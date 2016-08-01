var socketUser = function(email,socketid){
	this.email = email;
	this.socketid = socketid;
}

socketUser.prototype.getSocket = function(sockets){
	for(socket in sockets){
		if (this.socket == socket){
			return socket;
		}
	}
}

module.exports = socketUser;