var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	//photo_id: String,
	fb_id: String,
	lat: Number,
	lng: Number	
});

module.exports = mongoose.model('photo', photoSchema);
