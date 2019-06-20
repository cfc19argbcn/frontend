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
  port: process.env.PORT ? parseIntFromConfig(process.env.PORT) : defaultConfigs.port
};
module.exports = config;
