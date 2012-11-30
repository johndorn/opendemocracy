
var auth = require('../lib/auth');

exports.get = function(req, res) {
	var session = req.session;
	console.log('got request');
	/*
	return res.status(200).end(
		JSON.stringify({
			ok: true,
			cert: auth.getCertificate(req)
		})
	);
	*/

	res.render('index', {
		title: 'Home'
		, certificate: auth.getCertificate()
	});
};

