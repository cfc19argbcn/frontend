const http = require("http");
const https = require("https");

var options = (host, resource) => {
  return {
    host: host,
    path: resource,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
};

var req = (options, callback) => {
  const port = options.port == 443 ? https : http;
  let output = "";

  const req = port.request(options, res => {

    res.setEncoding("utf8");

    res.on("data", chunk => {
      output += chunk;
    });

    res.on("end", () => {
      let obj = JSON.parse(output);

      callback(res.statusCode, obj);
    });
  });

  req.on("error", err => {
    console.error(err);
  });

  req.end();
};

module.exports.req = req;
module.exports.options = options;
