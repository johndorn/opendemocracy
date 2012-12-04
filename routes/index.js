/*
var   login = require('./login')
	, logout = require('./logout')
	, certificate = require('./certificate')
	, home = require('./home')
	, register = require('./register');
*/

var modules = [
	'login'
	, 'logout',
	, 'certificate'
	, 'home'
	, 'register'
	, 'profile'
];

modules.forEach(function(itm) {
	exports[itm] = require('./' + itm);
});

/*
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.certificate = certificate;
exports.home = home;
exports.register = register;
*/

