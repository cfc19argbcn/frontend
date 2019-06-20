require("dotenv").config();

const defaultConfigs = {
  port: 3000
};

/** @param {string} configValue */
const parseIntFromConfig = (configValue) => {
  const parsedValue = parseInt(configValue);
  return parsedValue !== NaN ? parsedValue : defaultConfigs.port;
} 

var config = {
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
module.exports = config;
