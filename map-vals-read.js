var fs = require("fs");

/** @param {string} mapValsFile */
module.exports = (mapValsFile) => {
  var animal_data = []

  if (fs.existsSync(mapValsFile)) {
    try {
      animal_data = JSON.parse(fs.readFileSync(mapValsFile))
    } catch(err) { }
  } else {
    console.log("setting animal_data as empty var")
  }
  var animal_ids = [...new Set(animal_data.map(item => item["individual-local-identifier"]))];
  var animal_dict = {}
  var id, row
  for (id in animal_ids) {
    animal_dict[ animal_ids[id] ] = []
  }
  for (row in animal_data) {
    animal_dict[ animal_data[row]["individual-local-identifier"] ].push( animal_data[row] )
  }
  return animal_dict;
};
