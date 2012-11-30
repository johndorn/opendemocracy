
/**
 * Module dependencies.
 */

var express = require('express') // express already extends EventEmitter
  , path = require('path')
  , mongoose = require('mongoose')
  , events = require('events')
  , routes = require('./routes')
  , auth = require('./lib/auth')
  , stylus = require('stylus')
  , nib = require('nib');

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
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));	
	app.use(app.router);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {
		compileDebug: true
		, debug: true
		, pretty: true
	});
	app.use(stylus.middleware({ 
		src: __dirname + '/public',
		compile: function(str, path) {
			return stylus(str).set('filename', path).use(nib());
		}
	}));
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
var handlers = [
	  { path: '/', get: routes.home.get }
	, { path: '/login', get: routes.login.get, post: routes.login.post }
	, { path: '/register', get: routes.register.get, post: routes.register.post }
	//, { path: '/profile', get: [auth.restrict, routes.profile.get], post: [auth.restrict, routes.login.editProfile] } 
	, { path: '/certificate', get: [auth.restrict, routes.certificate.get], post: [auth.restrict, routes.certificate.post] } 
	//, { path: '/restricted', get: [auth.restrict, auth.verifyCertificate, routes.login.get] }
];

for( var i = 0, len = handlers.length; i < len; i++) {
	if(handlers[i].get) {
		var params = fixRoute('get', handlers[i].get);
		eval('app.get(handlers[i].path, ' + params.join(',') + ');');
	}
	if(handlers[i].put) {
		var params = fixRoute('put', handlers[i].put);
		eval('app.put(handlers[i].path, ' + params.join(',') + ');');
	}
	if(handlers[i].post) {
		var params = fixRoute('post', handlers[i].post);
		eval('app.post(handlers[i].path, ' + params.join(',') + ');');
	}
	if(handlers[i].delete) {
		var params = fixRoute('delete', handlers[i].delete);
		eval('app.delete(handlers[i].path, ' + params.join(',') + ');');
	}
}

function fixRoute(verb, handlers) {
	var newArr = [];
	if( ! handlers) {
		return newArr;
	}

	if(handlers.constructor.name == 'Array') {
		for( var i = 0, len = handlers.length; i < len; i++ ) {
			newArr.push('handlers[i]["' + verb + '"][' + i + ']');
		}
	} else {
		newArr.push('handlers[i].' + verb);
	}
	
	return newArr;
}

module.exports = app;
