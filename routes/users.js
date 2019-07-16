var request = require("../utils/request");
var cfg = require("../config");

var getUserById = function(req, res, next) {
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  var resource = request.options(cfg.resources.host, cfg.resources.clients);
  request.req(resource, (status, result) => {
    var _id = req.params.id;
    var client = result["clients"].find(c => c.id === _id);
    res.send(200, client || {});
  });
  next();
};

var getUserByName = function(req, res, next) {
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  var resource = request.options(cfg.resources.host, cfg.resources.clients);
  request.req(resource, (status, result) => {
    var name = req.params.name;
    var client = result["clients"].find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    res.send(200, client || {});
  });
  next();
};

module.exports.getUserById = getUserById;
module.exports.getUserByName = getUserByName;
