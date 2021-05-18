const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	accType: {
		type: String,
		required: true,
		default: 'Guest'
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	passChange: Date,
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
	},
	something: {
		type: String
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
