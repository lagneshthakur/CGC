var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('./DBSchema.js')
UserSchema = new Schema(db.collections["users"]);

var User = mongoose.model('users', UserSchema);

module.exports = User;