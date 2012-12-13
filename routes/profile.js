
var auth = require('../lib/auth');

// show login page or logged in page
exports.get = function(req, res) {

	// show login page
	res.render('profile', {
		title: 'My Profile'
		, certificate: auth.getCertificate()
	});
};

exports.post = function(req, res) {
	
};
