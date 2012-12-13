
var   auth = require('../lib/auth')
	, User = require('../lib/user');

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
	if(req.user) {
		res.redirect('/');
	}
	var   email = req.body.email
		, password = req.body.password;
	
	var user = new User();
	user.email = email;
	user.password = auth.hashPassword(email, password);
	user.save(function(err) {
		if(err)
			return res.render('index', { error: 'Error saving user: ' + err.message });

		return res.render('index', { feedback: 'User account created. Click the link to login.' });
	});
};
