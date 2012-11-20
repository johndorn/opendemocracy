
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
	saved_cert: {
		issuer: { // issued from
			C: String, // Country
			ST: String, // State, Company
			L: String, // Locality (city)
			O: String, // Operator
			OU: String, 
			CN: String // [Certificate] Common Name
		},
		subject: { // issued to
			C: String,
			ST: String,
			L: String,
			O: String,
			OU: String,
			CN: String
		},
		valid_from: Date,
		valid_to: Date,
		fingerprint: {
			type: String, // checksum ex: "2A:7A:C2:DD:E5:F9:CC:53:72:35:99:7A:02:5A:71:38:52:EC:8A:DF"
			index: {
				unique: true
			}
	},
	created: Date,
	updated: Date
});

// init the model with name "spam", schema from above, and store in "spamlist" collection
var User = mongoose.model('User', schema);

// export the model
module.exports = User;
