var bunyan = require('bunyan');

var request = require('../utils/request');
var cfg = require('../config');
var log = bunyan.createLogger({name: "policies"});

var getDevicesByID = function(req, res, next){
  if (['admin'].indexOf(req.userRole) >= 0) return res.send({ message: 'Failed to authenticate token.' });
	
	next();
}

var getUserByPolicyNumber = function(req, res, next){
	if (['admin'].indexOf(req.userRole) >= 0) return res.send({ message: 'Failed to authenticate token.' });
	
  next();
}

module.exports.getPoliciesByUser = getPoliciesByUser
module.exports.getUserByPolicyNumber = getUserByPolicyNumber
