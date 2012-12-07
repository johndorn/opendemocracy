
var   auth = require('../lib/auth')
	, Certificate = require('../lib/certificate')
	, User = require('../lib/user');

module.exports.get = function(req, res) {
	// show certificates view with cert info
	var req_id = req.params.id;
	var saved_cert_id = req.session.user.saved_cert;
	console.log(req.session.user);
	if( req_id && (req_id !== saved_cert_id) ) {
		return res.status(401).end(JSON.stringify({"ok":0, "error_msg":'Cert id ' + req_id + ' requested but not associated with user'}));
	}

	Certificate.findOne({"_id": saved_cert_id}, function(err, doc) {
		var error;
		console.log({err: err, doc: doc});
		var ret = doc ? doc : {};
		if(err) {
			error = 'Error getting certificate id ' + saved_cert_id + ': ' + err.message;
		}
		
		if(req_id) { // ajax
			if(err)
				return ajax_error(res, 500, err);
			return res.status(200).end(JSON.stringify({"ok":1, "cert": ret}));
		}
		return res.render('certificate', {
			title: 'Certificate',
			error: error,
			user_certificate: ret
		});
	});
};

module.exports.delete = function(req, res) {
	var req_id = req.params.id;
	var saved_cert_id = req.session.user.saved_cert;
	if( req_id && (req_id !== saved_cert_id) ) {
		return res.status(401).end(JSON.stringify({"ok":0, "error_msg":'Delete cert id ' + req_id + ' requested but not associated with user'}));
	}

	User.update({"_id":req.session.user._id}, {$set: {"saved_cert": null}}, function(err, user) {
		if(err)
			return ajax_error(res, 500, err);
		Certificate.find({"_id": saved_cert_id}).remove(function(err) {
			if(err)
				return ajax_error(res, 500, err);
			req.session.user.saved_cert = null;
			return res.status(200).end(JSON.stringify({"ok":1}));
		});
	});

};

module.exports.put = function(req, res) {
	// Attempt to save cert, trap duplicate fingerprint exception
	// Save user record with cert that now has id
	if(req.session.user.saved_cert)
		return res.status(405).end(JSON.stringify({"ok":0, "error_msg":"Certificate already installed. Please delete existing certificate to replace."}));
	console.log('got put');	
	new Certificate(auth.getCertificate()).save(function(err, cert) {
		console.log('save cert');	
		if(err)
			return ajax_error(res, 500, err);

		console.log('passed err - save cert ' + cert.id);	
		User.update({"_id":req.session.user._id}, {$set: {"saved_cert": cert.id}}, function(err, user) {
			console.log('update user');	
			if(err)
				return ajax_error(res, 500, err);
			console.log('passed err - update user ' + req.session.user.id);	
			/*req.session.regenerate(function(){
				// regenerate the session to save the user object with cert in the session
				req.session.user = user;
				req.session.success = 1;
				return res.status(200).end(JSON.stringify({"ok":1, "cert":cert}));
			});*/
			req.session.user.saved_cert = cert.id;
			console.log('set user session, returning');	
			return res.status(200).end(JSON.stringify({"ok":1, "cert":cert}));
		});
	});
};

function ajax_error(res, status, err) {
	console.log('error:');
	console.log(err);
	return res.status(status).end(JSON.stringify({"ok":0, "err":err}));
}
