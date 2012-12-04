
var auth = require('../lib/auth')
	, util = require('../lib/util');

exports.get = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

