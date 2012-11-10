
/**
 * Module dependencies.
 */

var express = require('express') // express already extends EventEmitter
  , path = require('path')
  , mongoose = require('mongoose')
  , events = require('events')
  , routes = require('./routes');

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
	app.use(express.session({
		store: {
			dbname: db.db.databaseName,
			host: db.db.serverConfig.host,
			port: db.db.serverConfig.port,
			username: db.uri.username,
			password: db.uri.password
		}
	}));
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);

module.exports = app;
