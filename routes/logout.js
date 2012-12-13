
var auth = require('../lib/auth');

exports.get = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

