
// show login page or logged in page
exports.get = function(req, res) {
	if(req.session.user) {
		res.redirect('/profile');
	}

	// show login page
};

// trigger login event
exports.post(req, res) {
	
	var target = 'back';
	if( req.body.intended_destination )
		target = req.body.intended_destination;

	authenticate(req.body.username, req.body.password, function(err, user){
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
			req.session.error = 'Invalid Username or Password';
			res.redirect('/login');
		}
	});
};
