var jwt = require("jsonwebtoken");
var config = require("../config");
var User = require("../models/user");
var bcrypt = require("bcryptjs");

var bunyan = require("bunyan");
var log = bunyan.createLogger({ name: "authentication" });

var verifyToken = function(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token) return res.send({ auth: false, message: "No token provided." });
  jwt.verify(token, config.jwt.secret, function(err, decoded) {
    if (err) {
      return res.send({
        auth: false,
        message: "Failed to authenticate token."
      });
    }
    req.userRole = decoded.role;
    next();
  });
};

var userAuth = function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.send("Error on the server.");
    if (!user) return res.send("No user found.");
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.send({ auth: false, token: null });
    var token = jwt.sign({ role: user.role }, config.jwt.secret, {
      expiresIn: 86400
    });
    res.send({ auth: true, token: token });
  });
};

module.exports.verifyToken = verifyToken;
module.exports.userAuth = userAuth;
