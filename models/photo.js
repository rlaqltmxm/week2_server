var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	//photo_id: String,
	fb_id: String,
	name: String,
	like: Number,
	date: Number,	
	lat: Number,
	lng: Number
		
});

module.exports = mongoose.model('photo', photoSchema);
