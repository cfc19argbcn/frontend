var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var config = require("../config");

var User = require("./user");
var Devices = require("./devices");

var users = require("./users.json");
var devices = require("./devices.json");


var createModels = function() {
  mongoose.connect(config.database.uri, { useNewUrlParser: true });
  User.insertMany(users, function(error, docs) {
    if (error) console.error(error);
    console.log('Users', docs)
    Devices.insertMany(devices, function(error, docs) {
      if (error) console.error(error);
      console.log('Devices', docs)
      mongoose.disconnect();
    });
  });
};


createModels();
