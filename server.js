var restify = require("restify");
var bunyan = require("bunyan");
var mongoose = require("mongoose");

var config = require("./config");

var users = require("./routes/users");
var devices = require("./routes/devices");
var authentication = require("./routes/authentication");

var log = bunyan.createLogger({ name: "server" });
var server = restify.createServer();

if (process.env.NODE_ENV === "test") {
  mongoose.connect(config.database.test.uri, { useNewUrlParser: true });
} else {
  mongoose.connect(config.database.uri, { useNewUrlParser: true });
}

log.info("Connect MongoDB ready on %s", config.database.uri);

server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.jsonp());

server.get("/", function root(req, res, next) {
  var routes = [
    "POST     /api/login",
    "POST     /api/user",
    "GET      /api/user/:id",
    "POST     /api/devices",
    "GET      /api/devices/:id",
    "GET      /api/mqtt_creds"
  ];
  log.info("/", routes);
  res.send(200, routes);
  next();
});

server.post("/api/login", authentication.userAuth);
server.post("/api/user", authentication.verifyToken, users.createUser);
server.get("/api/user/:id", authentication.verifyToken, users.getUserById);
server.post("/api/devices", authentication.verifyToken, devices.createDevices);
server.get("/api/devices/:id", authentication.verifyToken, devices.getDeviceById);
server.get("/api/mqtt_creds", authentication.verifyToken, devices.getMqttCreds);

server.get(/\/public\/?.*/, restify.serveStatic({
  directory: __dirname,
  default: 'index.html'
}));

server.listen(config.server.port, function() {
  const url = config.server.protocol + config.server.hostname + ":" + config.server.port + "/";
  log.info("Server ready on %s", url);
});
