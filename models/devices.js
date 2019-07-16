const mongoose = require('mongoose');

var DevicesSchema = new mongoose.Schema({
  id: String,
  name: String
});

mongoose.model('Devices', DevicesSchema);
module.exports = mongoose.model('Devices');
