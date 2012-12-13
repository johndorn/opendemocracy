
var   crypto = require('crypto')
	, hashing_algo = 'sha512'
	, mongoose = require('mongoose')
	, User = require('./user');

// Authentication config data
var session_secret_key = module.exports.session_secret_key = 'super secret session key here';
var password_hash_salt = module.exports.password_hash_salt = 'super secret password salt';

var mode = 'testing';

/**

Authentication helper functions

 */

/**
	certificateIsAuthorized(user, certificate)

	Validates certificate user combo

	Cerficate format:

	cert = {
		subject: {
			C: "UK",
			ST: "Acknack Ltd",
			L: "Rhys Jones",
			O: "node.js",
			OU: "Test TLS Certificate",
			CN: "localhost"
		},
		issuer: {
			C: "UK", // Country
			ST: "Acknack Ltd", // State, Company
			L: "Rhys Jones", // Locality (city)
			O: "node.js", // Operator
			OU: "Test TLS Certificate", 
			CN: "localhost" // [Certificate] Common Name
		},
		valid_from: "Nov 11 09:52:22 2009 GMT",
		valid_to: "Nov 6 09:52:22 2029 GMT",
		fingerprint: "2A:7A:C2:DD:E5:F9:CC:53:72:35:99:7A:02:5A:71:38:52:EC:8A:DF"
	}

 */

function certificateIsAuthorized(user, browser_cert, cb) {

	var authorized_cert = req.client.authorized; // whether cert is signed by our CA (defined in server.js)

	Certificate.findOne({"_id":user.saved_cert}, function(err, cert) {

		var   now = new Date().getTime()
			, valid_start = new Date(cert.valid_from).getTime()
			, valid_end = new Date(cert.valid_to).getTime();

		return cb(authorized_cert && (valid_start <= now) && (valid_end > now) && (browser_cert.fingerprint === cert.fingerprint));
	});
}

/**

Middleware functions

 */

// should change this to be a function that returns functions that
// restrict to authority levels
module.exports.restrict = function(level) {
	switch(level) {
	case 'admin':
		return function(req, res, next) {
			var reroute = true;
			if (req.session.user) {
				if(req.session.user.user_level == 1)
					reroute = false;
			}
			
			if(reroute) {
				// show login page
				res.render('login', {
					title: 'Login',
					error: 'You must be logged in to do that.'
				});
			} else {
				next();
			}
		};
	case 'ballot_admin':
		return function(req, res, next) {
			var reroute = true;
			if (req.session.user) {
				if(req.session.user.user_level <= 2)
					reroute = false;
			}
			
			if(reroute) {
				// show login page
				res.render('login', {
					title: 'Login',
					error: 'You must be logged in to do that.'
				});
			} else {
				next();
			}
		};
	case 'issue_admin':
		return function(req, res, next) {
			var reroute = true;
			if (req.session.user) {
				if(req.session.user.user_level <= 3)
					reroute = false;
			}
			
			if(reroute) {
				// show login page
				res.render('login', {
					title: 'Login',
					error: 'You must be logged in to do that.'
				});
			} else {
				next();
			}
		};
	default:
	// basic session enforcement
		return function(req, res, next) {
			var reroute = true;
			if (req.session.user) {
				reroute = false;
			}
			
			if(reroute) {
				// show login page
				res.render('login', {
					title: 'Login',
					error: 'You must be logged in to do that.'
				});
			} else {
				next();
			}
		};
	}
};

module.exports.verifyAdmin(req, res, next) {
	next();
};

module.exports.verifyCertificate = function(req, res, next) {
	// restrict() comes first
	// if(certificateIsValid(req.session.user, req.certificate)) { // not necessary, handled in server.js
	
	// req.client.authorized is boolen - whether the key is signed by our ca
	certificateIsAuthorized(req.session.user, getCertificate(req), function(is_authorized) { // key only signed if belonging to a user
		if(is_authorized)
			next();
		res.session.error('Invalid Certificate');
		return res.redirect('/certInvalid');
	});

};


/**

Helper functions

 */

/**
	lib/auth.authenticateUser(email, password, cb(err, user))
 */
module.exports.authenticateUser = function(email, password, cb) {
	User.findOne({email: email, password: hashPassword(email, password)}, function(err, user) {
		if(err) {
			return cb('Error retrieving user: ' + err, null);
		}
		
		if(! user) {
			return cb('Invalid email address or password.', null);
		}
		
		cb(null, user);
	});
};

/**
	lib/auth.hashPassword(password)
	Returns hash of 'password'
 */
function hashPassword(email, password) {
	var sha = crypto.createHash(hashing_algo);
	sha.update(password_hash_salt);
	sha.update(password);
	sha.update(email);
	return sha.digest('hex');
};
module.exports.hashPassword = hashPassword;

/**
	lib/auth.generateCertUserHash(password, cert, user)
	Generates checksum for user object using user-supplied password and cert.
	This hash will be checked whenever a vote is cast. A password will need to
	be supplied when vote is cast.
 */
module.exports.generateCertUserHash = function(password, cert, user) {
	var sha = crypto.createHash(hashing_algo);
	sha.update(password);
	sha.update(cert.fingerprint);
	sha.update(user.id);
	return sha.digest('hex');
};

/**

 */
function getCertificate(req) {

	if(mode != 'testing')
		return req.connection.getPeerCertificate();

	return {
		subject: {
			C: "UK",
			ST: "Acknack Ltd",
			L: "Rhys Jones",
			O: "node.js",
			OU: "Test TLS Certificate",
			CN: "localhost"
		},
		issuer: {
			C: "UK", // Country
			ST: "Acknack Ltd", // State, Company
			L: "Rhys Jones", // Locality (city)
			O: "node.js", // Operator
			OU: "Test TLS Certificate", 
			CN: "localhost" // [Certificate] Common Name
		},
		valid_from: "Nov 11 09:52:22 2009 GMT",
		valid_to: "Nov 6 09:52:22 2029 GMT",
		fingerprint: "2A:7A:C2:DD:E5:F9:CC:53:72:35:99:7A:02:5A:71:38:52:EC:8A:DF"
	};

}
module.exports.getCertificate = getCertificate;
