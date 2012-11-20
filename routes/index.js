
var   login = require('./login')
	, certificate = require('./certificate');

exports.login = login;
exports.certificate = login;

exports.index = function(req, res) {
	var session = req.session;
	
};


