require("dotenv").config();

var server = {
  name: "assessment-nodejs",
  protocol: "http://",
  hostname: "localhost",
  version: "0.0.1",
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8082
};

var database = {
  uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/auth",
  test: {
    uri: "mongodb://127.0.0.1:27017/test",
    client: "http://localhost:8082/"
  }
};

var jwt = {
  secret: "1tokeN&%$aXADsecret"
};

var resources = {
  host: "www.mocky.io",
  policies: "/v2/580891a4100000e8242b75c5",
  clients: "/v2/5808862710000087232b75ac"
};

const parseIntFromConfig = (configValue) => {
  const parsedValue = parseInt(configValue);
  return parsedValue !== NaN ? parsedValue : defaultConfigs.port;
} 

var mqtt = {
  port: process.env.PORT ? parseIntFromConfig(process.env.PORT) : defaultConfigs.port,
  mapValsFile: "map_vals.json",
  mqqtCredentials: {
    IOT_DEVICE_ID: process.env.IOT_DEVICE_ID,
    IOT_AUTH_TOKEN: process.env.IOT_AUTH_TOKEN,
    IOT_API_KEY: process.env.IOT_API_KEY,
    IOT_ORG_ID: process.env.IOT_ORG_ID,
    IOT_DEVICE_TYPE: process.env.IOT_DEVICE_TYPE,
    IOT_EVENT_TYPE: process.env.IOT_EVENT_TYPE
  }
};

module.exports.server = server;
module.exports.resources = resources;
module.exports.mqtt = mqtt;
module.exports.jwt = jwt;
module.exports.database = database;
