
// reference and init mongoose data store (mongodb driver)
var mongoose = require('mongoose');

// configure data store schema, omit "_id"
var schema = mongoose.Schema({
	email: {
		type: String, // email address
		index: {
			unique: true
		}
	},
	password: String, // password hash
	saved_cert: mongoose.Schema.ObjectId,
	created: Date,
	updated: Date
});

var User = mongoose.model('User', schema);

module.exports = User;
