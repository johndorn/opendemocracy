// reference and init mongoose data store (mongodb driver)
var mongoose = require('mongoose');

// configure data store schema, omit "_id"
var schema = mongoose.Schema({
	vote_mechanism: String, // instant run-off, ballot, etc
	type { // initiative, candidate election
		type: String 
	},
	subject: String,
	description: String,
	eli5: String, // ID of explain_like_im_five feature or eli5 string
	choices: [],
	created: Date,
	updated: Date
});

var Ballot = mongoose.model('Ballot', schema);

module.exports = Ballot;
