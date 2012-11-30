
var auth = require('../lib/auth');

exports.get = function(req, res) {
	if(req.user) {
		res.redirect('/');
	}
	
	res.render('register', {
		title: 'Register'
		, certificate: auth.getCertificate()
	});
};

exports.post = function(req, res) {

};
