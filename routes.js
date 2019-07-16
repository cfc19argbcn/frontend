const express = require("express");
const path = require("path");
const animalDict = require("./map-vals-read");
/** @param {import("express").Response} res */
const setApplicationJsonAsContentType = (res) =>
  res.setHeader("Content-Type", "application/json");

/**
 * @param {import("express").Express} app
 * @param {import("./config/app-env")} param1
 */
module.exports = (app, { mapValsFile, mqqtCredentials }) => {
  app.get("/", (_, res) => res.sendFile("index.html" , { root : __dirname}));
  app.get("/users", (_, res) => res.sendFile("public/html/users/index.html" , { root : __dirname}));
  app.get("/login", (_, res) => res.sendFile("public/html/users/login/index.html" , { root : __dirname}));
  app.get("/sensors", (_, res) => res.sendFile("public/html/sensors/index.html" , { root : __dirname}));
  app.get("/mqtt_creds", (_, res) => {
    setApplicationJsonAsContentType(res);
    res.send(JSON.stringify(mqqtCredentials));
  });
  app.use(express.static(path.join(__dirname, "public")));
  app.get("/animal_data", (_, res) => {
    setApplicationJsonAsContentType(res);
    res.send(JSON.stringify(animalDict(mapValsFile)));
  });
  app.get(`/${mapValsFile}`, (_, res) =>
    res.sendFile(mapValsFile , { root : __dirname}));
};
