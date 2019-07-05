var bunyan = require('bunyan');

var request = require('../utils/request');
var cfg = require('../config');
var log = bunyan.createLogger({name: "users"});

var getUserById = function(req, res, next){
  if (['admin', 'user'].indexOf(req.userRole) >= 0) return res.send({ message: 'Failed to authenticate token.' });

	next();
}

var getUserByName = function(req, res, next){
  if (['admin', 'user'].indexOf(req.userRole) >= 0) return res.send({ message: 'Failed to authenticate token.' });

  next(); 
}

module.exports.getUserById = getUserById
module.exports.getUserByName = getUserByName
