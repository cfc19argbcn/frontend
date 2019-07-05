const mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({

});

mongoose.model('Device', DeviceSchema);
module.exports = mongoose.model('Device');
