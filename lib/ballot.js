// reference and init mongoose data store (mongodb driver)
var mongoose = require('mongoose');

// configure data store schema, omit "_id"
var schema = mongoose.Schema({
	issues: [], // array of issue ids
	created: Date,
	updated: Date
});

var Ballot = mongoose.model('Ballot', schema);

module.exports = Ballot;
