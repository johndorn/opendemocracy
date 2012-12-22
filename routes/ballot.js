
var Ballot = require('../lib/ballot');

module.exports.get = function(req, res) {

	if(! req.params.id) {
		var d = new Date();
		Ballot.find({ start: {$lt: d}, $or:[ {end: null}, {end: {$gt: d}} ] }, function(err, docs) {
			return res.render('ballot_menu', {
				title: 'Select Ballot',
				ballots: docs,
				error: err.message
			});
		});
		return true;
	}

	Ballot.findOne({ "_id": req.params.id }, function(err, doc) {
		return res.render('ballot', {
			title: 'Select Ballot',
			ballot: doc,
			error: err.message
		});
	});
};

module.exports.create = {};

module.exports.create.get = function(req, res) {
	return res.render('ballot_create', {
		title: 'Create Ballot'
	});
};

module.exports.create.post = module.exports.create.put = function(req, res) {
	
};

module.exports.submit.post = module.exports.submit.put = function(req, res) {

};

