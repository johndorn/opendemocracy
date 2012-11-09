
// Initialize the cluster and get reference to http object
var cluster = require('cluster')
  , http = require('http');

var cpus = require('os').cpus().length || 1;

// If we're the master, fork for each CPU
if ( cluster.isMaster ) {
	
	for ( var i = 0; i < cpus; ++i )
		cluster.fork();
	
	cluster.on('death', function(worker) {
		console.warn('service worker ' + worker.pid + ' died.');
	});

} else {

	// Gets reference to app from ./app.js
	// app type is express
	var app = require('./app');
	
	var server = module.exports = http.createServer(app).listen(app.get('port'), function() {
		console.warn('service listening on port ' + app.get('port'));
	});

}
