
/**
 * Module dependencies.
 */

var express = require('express') // express already extends EventEmitter
  , path = require('path')
  , mongoose = require('mongoose')
  , events = require('events')
  , routes = require('./routes')
  , auth = require('./lib/auth');

//var db = mongoose.connect('mongo://localhost/opendemocracy');

/**
 */

var app = express();

app.configure(function(){
	app.set('port', 443);
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
	  { path: '/', get: routes.home.get }
	, { path: '/login', get: routes.login.get, post: routes.login.post }
	//, { path: '/profile', get: [auth.restrict, routes.profile.get], post: [auth.restrict, routes.login.editProfile] } 
	, { path: '/certificate', get: [auth.restrict, routes.certificate.get], post: [auth.restrict, routes.certificate.post] } 
	//, { path: '/restricted', get: [auth.restrict, auth.verifyCertificate, routes.login.get] }
];

console.log('configuring routes');
console.log(routes);

for( var i = 0, len = routes.length; i < len; i++) {
	if(routes[i].get) {
		var params = fixRoute('get', routes[i].get);
		console.log('loading get for ' + routes[i].path);
		console.log(params);
		console.log('app.get(routes[i].path, ' + params.join(',') + ');');
		eval('app.get(routes[i].path, ' + params.join(',') + ');');
		//app.get.apply(app.get, fixRoute(routes[i].path, routes[i].get));
	}
	if(routes[i].put) {
		var params = fixRoute('put', routes[i].put);
		eval('app.put(routes[i].path, ' + params.join(',') + ');');
		//app.put.apply(app.put, fixRoute(routes[i].path, routes[i].put));
	}
	if(routes[i].post) {
		var params = fixRoute('post', routes[i].post);
		eval('app.post(routes[i].path, ' + params.join(',') + ');');
		//app.post.apply(app.post, fixRoute(routes[i].path, routes[i].post));
	}
	if(routes[i].delete) {
		var params = fixRoute('delete', routes[i].delete);
		eval('app.delete(routes[i].path, ' + params.join(',') + ');');
		//app.delete.apply(app.delete, fixRoute(routes[i].path, routes[i].delete));
	}
}

function fixRoute(verb, routes) {
	var newArr = [];
	console.log(fixRoute);
	if( ! routes) {
		return newArr;
	}

	if(routes.constructor.name == 'Array') {
		for( var i = 0, len = routes.length; i < len; i++ ) {
			newArr.push('routes[i]["' + verb + '"][' + i + ']');
		}
	} else {
		newArr.push('routes[i].' + verb);
	}
	console.log(newArr);
	return newArr;
}

module.exports = app;
