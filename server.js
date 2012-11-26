
// Initialize the cluster and get reference to http object
var cluster = require('cluster')
  , https = require('https')
  , fs = require('fs');

var argv = require('optimist')
	.usage('Start web service.\nUsage $0')
	.default('k','./testing/keys/ca.key')
	.alias('k', 'private-key')
	.describe('k', 'Server Private Key File')
	.default('a', './testing/certs/ca.crt')
	.alias('a', 'certificate-authority')
	.describe('a', 'Server Certificate Authority File')
	.default('c','./testing/certs/server_ssl_cert.crt')
	.alias('c', 'client-certificate')
	.describe('c', 'Server SSL Certificate (for client) File')
	.argv;

//var cpus = require('os').cpus().length || 1;
var cpus = 1;

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
	var serverOpts = {
		key: fs.readFileSync(argv.k), // server private key
		cert: fs.readFileSync(argv.c), // server certificate
		ca: fs.readFileSync(argv.a), // authorized certificate authority
		requestCert: true, // get client cert
		rejectUnauthorized: false // reject unauthorized certificates
	};

	var server = module.exports = https.createServer(serverOpts, app).listen(app.get('port'), function() {
		console.warn('service listening on port ' + app.get('port'));
	});

}
