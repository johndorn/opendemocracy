
var   crypto = require('crypto')
	, hashing_algo = 'sha512';

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

function certificateIsAuthorized(user, cert) {

	if( (! user) || (! cert) )
		return false;

	var authorized_cert = req.client.authorized; // whether cert is signed by our CA (defined in server.js)

	if( (! authorized_cert) || (cert.fingerprint != user.saved_cert.fingerprint) )
		return false;

	var   now = new Date().getTime()
		, valid_start = new Date(cert.valid_from).getTime()
		, valid_end = new Date(cert.valid_to).getTime();

	if((valid_start > now) || (valid_end <= now) )
		return false;

	return true;
}

/**

Middleware functions

 */

module.exports.restrict = function(req, res, next) {
	// basic session enforcement
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};

module.exports.verifyCertificate = function(req, res, next) {
	// restrict() comes first
	// if(certificateIsValid(req.session.user, req.certificate)) { // not necessary, handled in server.js
	
	// req.client.authorized is boolen - whether the key is signed by our ca
	if(certificateIsAuthorized(req.user, getCertificate(req))) { // key only signed if belonging to a user
		next();
	}

	res.session.error('Invalid Certificate');
	res.redirect('/certInvalid');
};


/**

Helper functions

 */

/**
	lib/auth.authenticateUser(email, password, cb(err, user))
 */
module.exports.authenticateUser = function(email, password, cb) {
	var users = mongoose.model('User');
	users.findOne({email: email, password: hash(password)}, function(err, user) {
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
module.exports.hashPassword = function(password, user) {
	var sha = crypto.createHash(hashing_algo);
	sha.update(password_hash_salt);
	sha.update(password);
	sha.update(user.id);
	return sha.digest('hex');
};

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
