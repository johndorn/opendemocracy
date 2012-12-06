var mongoose = require('mongoose');
var schema = mongoose.Schema({
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
	}
});

var Certificate = mongoose.model('Certificate', schema);

module.exports = Certificate;
