var bunyan = require("bunyan");
var cfg = require("../config");
var log = bunyan.createLogger({ name: "devices" });
var Devices = require("./models/devices");


var getDeviceById = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
  Devices.findOne({id: req.body.id},  function(error, docs) {
  	res.send(docs);
  })
  next();
}

var createDevices = function(req, res, next){
  if (["admin", "user"].indexOf(req.userRole) < 0)
    return res.send({ message: "You do not have permission" });
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


// module.exports = (app, { mapValsFile, mqqtCredentials }) => {
//   app.get("/", (_, res) => res.sendFile("index.html" , { root : __dirname}));
//   app.get("/mqtt_creds", (_, res) => {
//     setApplicationJsonAsContentType(res);
//     res.send(JSON.stringify(mqqtCredentials));
//   });
//   app.use(express.static(path.join(__dirname, "public")));
//   app.get("/animal_data", (_, res) => {
//     setApplicationJsonAsContentType(res);
//     res.send(JSON.stringify(animalDict(mapValsFile)));
//   });
//   app.get(`/${mapValsFile}`, (_, res) =>
//     res.sendFile(mapValsFile , { root : __dirname}));
// };