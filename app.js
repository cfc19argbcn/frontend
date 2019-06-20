const express = require("express");
const app = express();
const appConfig = require("./config/app-env");
app.listen(appConfig.port,
  () => console.log(`App listening on port ${appConfig.port}`)
);
