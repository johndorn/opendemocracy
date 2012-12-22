// reference and init mongoose data store (mongodb driver)
var mongoose = require('mongoose');

var IssueSchema = mongoose.Schema({
	vote_mechanism: String, // instant run-off, ballot, etc
	type { // initiative, candidate election
		type: String 
	},
	subject: String,
	description: String,
	eli5: String, 
	choices: [ String ]
});

var BallotSchema = mongoose.Schema({
	issues: [ IssueSchema ], // array of Issue objects
	createdBy: mongoose.Schema.ObjectId,
	created: Date,
	updated: Date,
	start: Date,
	end: Date
});

var Ballot = mongoose.model('Ballot', BallotSchema);

module.exports = Ballot;
