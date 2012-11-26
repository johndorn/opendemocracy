
/**
 * Module dependencies.
 */

var express = require('express') // express already extends EventEmitter
  , path = require('path')
  , mongoose = require('mongoose')
  , events = require('events')
  , routes = require('./routes')
  , auth = require('./lib/auth');

var db = mongoose.connect('mongo://localhost/opendemocracy');

/**
 */

var app = express();

app.configure(function(){
	app.set('port', 80);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: auth.session_secret_key
	}));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

/*
	list of objects
	structure:
	{
		// required:
		path: 'express app match expression',

		// optional:
		get: function(req, res),
		put: function(req, res),
		post: function(req, res),
		delete: function(req, res),
	}
*/
var routes = [
	  { path: '/', get: routes.index }
	, { path: '/login', get: routes.login.get, post: routes.login.post }
	//, { path: '/profile', get: [auth.restrict, routes.profile.get], post: [auth.restrict, routes.login.editProfile] } 
	, { path: '/certificate', get: [auth.restrict, routes.certificate.get], post: [auth.restrict, routes.certificate.post] } 
	//, { path: '/restricted', get: [auth.restrict, auth.verifyCertificate, routes.login.get] }
];

for( var i = 0, len = routes.length; i < len; i++) {
	if(routes[i].get) {
		var params = fixRoute(routes[i].get);
		eval('app.get(routes[i].path, ' + params.join(',') + ');');
		//app.get.apply(app.get, fixRoute(routes[i].path, routes[i].get));
	}
	if(routes[i].put) {
		var params = fixRoute(routes[i].put);
		eval('app.put(routes[i].path, ' + params.join(',') + ');');
		//app.put.apply(app.put, fixRoute(routes[i].path, routes[i].put));
	}
	if(routes[i].post) {
		var params = fixRoute(routes[i].post);
		eval('app.post(routes[i].path, ' + params.join(',') + ');');
		//app.post.apply(app.post, fixRoute(routes[i].path, routes[i].post));
	}
	if(routes[i].delete) {
		var params = fixRoute(routes[i].delete);
		eval('app.delete(routes[i].path, ' + params.join(',') + ');');
		//app.delete.apply(app.delete, fixRoute(routes[i].path, routes[i].delete));
	}
}

function fixRoute(path, routes) {
	var newArr = [path];
	
	if( ! routes) {
		return newArr;
	}

	if(routes.constructor.name == 'Array') {
		for( var i = 0, len = routes.length; i < len; i++ ) {
			newArr.push(routes[i]);
		}
	} else {
		newArr.push(routes);
	}
	
	return newArr;
}

module.exports = app;
