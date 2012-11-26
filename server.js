
// Initialize the cluster and get reference to http object
var cluster = require('cluster')
  , https = require('https');

var argv = require('optimist')
	.usage('Start web service.\nUsage $0')
	.demand('k')
	.alias('k', 'private-key')
	.describe('k', 'Server Private Key File')
	.demand('a')
	.alias('a', 'certificate-authority')
	.describe('a', 'Server Certificate Authority File')
	.demand('c')
	.alias('c', 'client-certificate')
	.describe('c', 'Server SSL Certificate (for client) File')
	.argv;

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
	var serverOpts = {
		key: fs.readFileSync('./keys/ca.key'), // server private key
		cert: fs.readFileSync('ssl/server.crt'), // server certificate
		ca: fs.readFileSync('./certs/ca.crt'), // authorized certificate authority
		requestCert: true, // get client cert
		rejectUnauthorized: false // reject unauthorized certificates
	};

	var server = module.exports = https.createServer(serverOpts, app).listen(app.get('port'), function() {
		console.warn('service listening on port ' + app.get('port'));
	});

}
