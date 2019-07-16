var bunyan = require("bunyan");

var request = require("../utils/request");
var cfg = require("../config");
var log = bunyan.createLogger({ name: "policies" });

var getPoliciesByUser = function(req, res, next) {
  if (["admin"].indexOf(req.userRole) < 0)
    return res.send({ message: "Failed to authenticate token." });
  var opt_clients = request.options(cfg.resources.host, cfg.resources.clients);
  var opt_policies = request.options(
    cfg.resources.host,
    cfg.resources.policies
  );
  request.req(opt_clients, (status, result) => {
    var name = req.params.name;
    var client = result["clients"].find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (client) {
      request.req(opt_policies, (status, result) => {
        var _id = client["id"];
        var policies = [];
        result["policies"].find(function(p) {
          if (p.clientId === _id) policies.push(p);
        });
        res.send(200, policies || []);
      });
    } else {
      res.send(200, []);
    }
  });
  next();
};

var getUserByPolicyNumber = function(req, res, next) {
  if (["admin"].indexOf(req.userRole) < 0)
    return res.send({ message: "Failed to authenticate token." });
  var opt_clients = request.options(cfg.resources.host, cfg.resources.clients);
  var opt_policies = request.options(
    cfg.resources.host,
    cfg.resources.policies
  );
  request.req(opt_policies, (status, result) => {
    var number = req.params.number;
    var policy = result["policies"].find(p => p.id === number);
    if (policy) {
      request.req(opt_clients, (status, result) => {
        var _id = policy["clientId"];
        client = result["clients"].find(o => o.id === _id);
        res.send(200, client || {});
      });
    } else {
      res.send(200, []);
    }
  });
  next();
};

module.exports.getPoliciesByUser = getPoliciesByUser;
module.exports.getUserByPolicyNumber = getUserByPolicyNumber;
