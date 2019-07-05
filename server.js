var restify = require('restify');
var bunyan = require('bunyan');
var mongoose = require('mongoose');

var config = require('./config');
var devices = require('./routes/devices');
var authentication = require('./routes/authentication');
var users = require('./routes/users');

var log = bunyan.createLogger({name: "server"});
var server = restify.createServer();

mongoose.connect(config.database.uri, { useNewUrlParser: true });
log.info('Connect MongoDB ready on %s', config.database.uri);

server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.jsonp());

server.post('/login', authentication.userAuth);
server.get('/user/:id', authentication.verifyToken, users.getUserById);
server.get('/devices', authentication.verifyToken, policies.getPoliciesByUser);

server.listen(config.server.port, function () {
	const url = config.server.protocol + config.server.hostname + ":" +config.server.port + "/";
    log.info('Server ready on %s', url);
});
