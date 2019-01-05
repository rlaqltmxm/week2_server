var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
 	//user_id: String,
	fb_id: String,
	contacts:[{
		_id: String,
		name: String,
		phone: String}]
});

module.exports = mongoose.model('contact', contactSchema);
