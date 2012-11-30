
var auth = require('../lib/auth');

module.exports.get = function(req, res) {
	// show certificates view with cert info
	res.render('index', {
		title: 'Home'
		, certificate: auth.getCertificate()
	});
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
					var cert = auth.getCertificate(req);
					if(validateCert(req, cert)) {
						req.session.user.saved_cert = cert;
						req.session.user.updated = new Date();
						
						// TODO Update to use certificate object
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
					req.session.error = 'No certificate saved.';
				}
				break;
			default:
				req.session.error = 'Invalid Request';
		};
	} else {
		req.session.error = 'Invalid Password';
	}

	res.redirect('/certificate');
};

function validateCert(cert) {
	var valid = true;
	var required_keys = ['issuer', 'subject', 'valid_from', 'valid_to', 'fingerprint'];
	for(var i = 0, len = required_keys.length; i < len; i++) {
		if( ! cert[required_keys[i]] )
			valid = false;
	}

	var req_subkeys = ['C', 'ST', 'L', 'O', 'OU', 'CN'];
	for(var i = 0, len = req_subkeys.length; i < len; i++) {
		if( ! (cert['issuer'][req_subkeys[i]] && cert['subject'][req_subkeys[i]]) )
			valid = false;
	}
	
	return (valid && req.client.authorized);
}

