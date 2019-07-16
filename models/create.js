var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var config = require("../config");

var User = require("./user");
var Devices = require("./devices");

var users = require("./users.json");
var devices = require("./devices.json");


var createManyDevices = function() {
  mongoose.connect(config.database.uri, { useNewUrlParser: true });
  Devices.insertMany(devices, function(error, docs) {
    if (error) console.error(error);
    mongoose.disconnect();
  });
};

var createManyUsers = function() {
  mongoose.connect(config.database.uri, { useNewUrlParser: true });
  User.insertMany(users, function(error, docs) {
    if (error) console.error(error);
    mongoose.disconnect();
  });
};


createManyDevices();
createManyUsers();
