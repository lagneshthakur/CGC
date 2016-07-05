var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactsSchema = new Schema({
	name: String, 
	email: String, 
	number: String
});

var contacts = mongoose.model('contacts', contactsSchema);