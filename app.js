const express = require("express");
const app = express();
const appConfig = require("./config/app-env");
require("./routes")(app, appConfig);
app.listen(appConfig.port,
  () => console.log(`App listening on port ${appConfig.port}`)
);
