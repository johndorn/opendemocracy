
var auth = require('../../lib/auth');

module.exports.get = function(req, res) {
	// show certificates view with cert list
};

module.exports.post = function(req, res) {
	// add new cert, or remove existing one
	// would be better to use DELETE http method, but we only do cert changes
	// after user has re-entered password
	
	var provided_password = auth.hash(req.body.current_password);
	if(provided_password == req.session.user.password) {
		switch(req.action) {
			case 'add':
				if( req.session.user.saved_cert ) {
					req.session.error = 'Certificate already exists.';
				} else {
					if(validateCert(req.session.user, cert)) {
						req.session.user.saved_cert = req.connection.getPeerCertificate();
						req.session.user.updated = new Date();
						req.session.user.save(function(err) {
							if(err) {
								req.session.error = 'Error saving certificate: ' + err;
								console.log('Cert saving error');
								console.log(err);
							}

							req.session.user = user;
							res.redirect('/certificate');
						});
					}
				}
				break;
			case 'remove':
				if( req.session.user.saved_cert ) {
					req.session.user.saved_cert = null;
					req.session.user.updated = new Date();
					req.session.user.save(function(err) {
						if(err) {
							req.session.error = 'Error removing certificate: ' + err;
							console.log('Cert removing error');
							console.log(err);
						}
						res.redirect('/certificate');
					});
				} else {
					error = 'No certificate saved.';
				}
				break;
			case default:
				req.session.error = 'Invalid Request';
		};
	} else {
		req.session.error = 'Invalid Password';
	}

	res.redirect('/certificate');
};
