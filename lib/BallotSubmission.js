// reference and init mongoose data store (mongodb driver)
var mongoose = require('mongoose');

var collection_name = 'BallotSubmissions';

// configure data store schema, omit "_id"
var base_schema_def = {
	previous_node: mongoose.Schema.ObjectId,
	signature: String,
	created: Date,
	updated: Date
};

var BallotSubmission = mongoose.model('BallotSubmission', base_schema_def, collection_name);

module.exports = Ballot;
