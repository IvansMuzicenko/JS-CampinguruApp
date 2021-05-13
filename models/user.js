const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	nickname: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	tel: {
		type: String
	},
	address: {
		type: String
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
