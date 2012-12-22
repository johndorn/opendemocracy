
var mongoose = require('mongoose');

var IssueSubmissionSchema = mongoose.Schema({
	issue_id: mongoose.Schema.ObjectId,
	vote: []
})

var BallotSubmissionSchema = mongoose.Schema({
	previous_node: mongoose.Schema.ObjectId,
	selections: [ IssueSubmissionSchema ],
	signature: String,
	created: Date,
	updated: Date
});

var BallotSubmission = mongoose.model('BallotSubmission', BallotSubmissionSchema);

module.exports = BallotSubmission;
