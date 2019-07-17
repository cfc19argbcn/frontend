var bunyan = require("bunyan");
var cfg = require("../config");
var log = bunyan.createLogger({ name: "devices" });
var Devices = require("../models/devices");


var getDeviceById = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  Devices.findOne({id: req.body.id},  function(error, docs) {
    res.send(docs);
  });
  next();
}

var createDevices = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  Devices.create({
    name:req.body.name
  }, function (err, user) {
    if (err) return handleError(err);
    res.send(user);
  });
  next();
}

var getMqttCreds = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  return res.send({mqtt: cfg.mqtt});
  next();
}

module.exports.getDeviceById = getDeviceById;
module.exports.createDevices = createDevices;
module.exports.getMqttCreds = getMqttCreds;
