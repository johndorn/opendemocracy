
var auth = require('../lib/auth');

// show login page or logged in page
exports.get = function(req, res) {
	if(req.session.user) {
		res.redirect('/');
	}

	// show login page
	res.render('login', {
		title: 'Login'
	});
};

// trigger login event
exports.post = function(req, res) {
	
	var target = 'back';
	if( req.body.intended_destination )
		target = req.body.intended_destination;

	auth.authenticateUser(req.body.email, req.body.password, function(err, user){
		if (user) {
			// Regenerate session when signing in
			// to prevent fixation 
			req.session.regenerate(function(){
				// Store the user's primary key 
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.user = user;
				req.session.success = 1;
				res.redirect(target);
			});
		} else {
			res.render('login', {
				title: 'Login'
				, error: 'Login failure, check credentials and try again'
			});
		}
	});
};
