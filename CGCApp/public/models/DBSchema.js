var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var DBSchema = {
	users:{
		name: {
		  first: { type: String, required: true},
		  last: { type: String, required: true}
		},
		email: { type: String, required: true, unique: true, index:true},
		password: { type: String },
		dob: {type:Date},
		following: [{
			id: {type: ObjectId, required:true, unique: true},
			name: {
			  first: { type: String, required: true},
			  last: { type: String, required: true}
			}
		}] ,
		follower: [{
			id: {type: ObjectId, required:true},
			name: {
			  first: { type: String, required: true},
			  last: { type: String, required: true}
			}
		}] 
	},
	posts:{
		user_id: {type: ObjectId, required:true ,ref: 'User' },
		content: {type: String},
	}
};
module.exports.collections = DBSchema;