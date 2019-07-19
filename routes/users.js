var cfg = require("../config");
var User = require("../models/user");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

var getUserById = function(req, res, next) {
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  User.findOne({ id: req.body.id }, function(error, docs) {
    res.send(docs);
  });
  next();
};

var createUser = function(req, res, next) {
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  User.create(
    {
      username: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, salt)
    },
    function(err, user) {
      if (err) return handleError(err);
      res.send(user);
    }
  );
  next();
};

module.exports.getUserById = getUserById;
module.exports.createUser = createUser;
