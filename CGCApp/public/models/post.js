var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('./DBSchema.js')
PostSchema = new Schema(db.collections["posts"]);

var Post = mongoose.model('posts', PostSchema);

module.exports = Post;