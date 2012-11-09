
/**
 * Module dependencies.
 */

var express = require('express') // express already extends EventEmitter
  , path = require('path')
  , mongoose = require('mongoose')
  , events = require('events');

// mongoose.connect('mongo://localhost/mir');

/**
 */


var app = express();

app.configure(function(){
	//app.set('port', process.env.PORT || 3001);
	app.set('port', 3001);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);

module.exports = app;
