var cfg = require("../config");

var getUserById = function(req, res, next) {
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  next();
};

var createUser = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });  
  next();
}

module.exports.getUserById = getUserById;
module.exports.createUser = createUser;
