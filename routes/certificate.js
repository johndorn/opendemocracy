
var   auth = require('../lib/auth')
	, Certificate = require('../lib/certificate')
	, User = require('../lib/user');

module.exports.get = function(req, res) {
	// show certificates view with cert info
	var saved_cert_id = req.session.user.saved_cert;
	
	var cb = function(error, feedback, certificate) {
		return res.render('certificate', {
			title: 'certificate',
			error: error,
			feedback: feedback,
			user_stored_certificate: certificate
		});
	}
	Certificate.findOne({"id": saved_cert_id}, function(err, doc) {
		if(err) {
			return cb(err.message, '', {});
		}
		return cb('', '', doc);
	});
};

module.exports.delete = function(req, res) {
	var user = new User(req.session.user); // Is this a mongoose model obj?

	user.saved_cert = null;
	user.save(function(err) {
		var template_vars = {
			title: 'Certificate'
		};

		if(err) {
			template_vars.error = 'Certificate removal error: ' + err.message;
		}

		return res.render('certificate', {
			title: 'Certificate'
			, certificate: auth.getCertificate()
		});
	});

};

module.exports.put = function(req, res) {
	// Attempt to save cert, trap duplicate fingerprint exception
	// Save user record with cert that now has id
	console.log('got put');
	new Certificate(auth.getCertificate()).save(function(err) {
		if(err) {
			if(err.code === 11000) {
				req.session.error = 'Invalid certificate. This certificate is already in use.'
			} else {
				req.session.error = 'Error saving certificate: ' + err.message;
			}
		}
		console.log('redirecting');
		return res.redirect('/certificate');
	});
};

