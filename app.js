
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
  //, mw_template = require('./lib/express/template_middleware');

var db = mongoose.connect('mongo://localhost/opendemocracy');

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
	, { path: '/logout', get: routes.logout.get }
	, { path: '/register', get: routes.register.get, post: routes.register.post }
	, { path: '/profile', get: [auth.restrict(), routes.profile.get], post: [auth.restrict(), routes.profile.post] } 
	, { path: '/certificate/:id?', get: [auth.restrict(), routes.certificate.get], put: [auth.restrict(), routes.certificate.put], delete: [auth.restrict(), routes.certificate.delete] }
	// should change auth.restrict() to auth.restrict()(auth_level) that returns a function reference
	// verifying access of auth_level
	, { path: '/ballot/create', put: [auth.restrict('ballot_admin'), auth.verifyCertificate, routes.ballot.create.put], post: [auth.restrict(), auth.verifyAdmin, auth.verifyCertificate, routes.ballot.create.post]}
	, { path: '/ballot/submit', put: [auth.restrict(), auth.verifyCertificate, routes.ballot.put], post: [auth.restrict(), auth.verifyCertificate, routes.ballot.post]}
	, { path: '/ballot/:id?', get: [auth.restrict(), auth.verifyCertificate, routes.ballot.get] }
	, { path: '/issue/create', put: [auth.restrict('issue_admin'), auth.verifyCertificate, routes.issue.put], post: [auth.restrict(), auth.verifyAdmin, auth.verifyCertificate, routes.issue.post]}
	, { path: '/issue/:id?', get: [auth.restrict(), auth.verifyCertificate, routes.issue.get] }
	//, { path: '/restricted', get: [auth.restrict(), auth.verifyCertificate, routes.login.get] }
];

function baseVariables(req, res, next) {
	res.locals.user = req.session.user;
	res.locals.session = req.session;
	res.locals.sub_nav = {};

	// These can provide feedback via session variables or template bindings
	res.locals.error = req.session.error; 
	res.locals.feedback = req.session.feedback;
	next();
}

for( var i = 0, len = handlers.length; i < len; i++) {
	console.log(handlers[i]);
	if(handlers[i].get) {
		var params = fixRoute('get', handlers[i].get);
		console.log('setting get');
		eval('app.get(handlers[i].path, baseVariables, ' + params.join(',') + ');');
	}
	if(handlers[i].put) {
		var params = fixRoute('put', handlers[i].put);
		console.log('setting put');
		eval('app.put(handlers[i].path, baseVariables, ' + params.join(',') + ');');
	}
	if(handlers[i].post) {
		var params = fixRoute('post', handlers[i].post);
		console.log('setting post');
		eval('app.post(handlers[i].path, baseVariables, ' + params.join(',') + ');');
	}
	if(handlers[i].delete) {
		var params = fixRoute('delete', handlers[i].delete);
		console.log('setting delete');
		eval('app.delete(handlers[i].path, baseVariables, ' + params.join(',') + ');');
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
