var restify = require("restify");
var bunyan = require("bunyan");
var mongoose = require("mongoose");

var config = require("./config");
var policies = require("./routes/policies");
var authentication = require("./routes/authentication");
var users = require("./routes/users");

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
    "POST    /login",
    "GET     /user/:id",
    "GET     /user/name/:name",
    "GET     /policies/:name",
    "GET     /policies/:number/user"
  ];
  log.info("/", routes);
  res.send(200, routes);
  next();
});

server.post("/login", authentication.userAuth);
server.get("/user/:id", authentication.verifyToken, users.getUserById);
server.get("/user/name/:name", authentication.verifyToken, users.getUserByName);
server.get(
  "/policies/:name",
  authentication.verifyToken,
  policies.getPoliciesByUser
);
server.get(
  "/policies/:number/user",
  authentication.verifyToken,
  policies.getUserByPolicyNumber
);

server.listen(config.server.port, function() {
  const url = config.server.protocol + config.server.hostname + ":" + config.server.port + "/";
  log.info("Server ready on %s", url);
});
