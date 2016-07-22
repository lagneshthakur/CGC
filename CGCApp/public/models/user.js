var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var db = require('./DBSchema.js')
UserSchema = new Schema(db.collections["users"]);

var User = mongoose.model('users', UserSchema);

module.exports = User;

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        // Store hash in your password DB. 
	        newUser.password = hash;
	        newUser.save(callback);
	    });
});
}

module.exports.getUserByEmail = function (email , callback){
	var query = {email: email};
	User.findOne(query,callback);
};

module.exports.getUserById = function (id , callback){
	User.findById(id,callback);
}

module.exports.comparePassword = function (candidatePassword , hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null,isMatch);
	})
};