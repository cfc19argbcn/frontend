var mongoose = require("mongoose");
var User = require("../models/user");
var config = require("../config");
var users = require("../models/users.json");
var assert = require("chai").assert;

var restify = require("restify-clients");

// init the test client
var client = restify.createJsonClient({
  url: config.database.test.client
});

describe("Connection Model", function() {
  before(function(done) {
    mongoose.connect(config.database.test.uri, { useNewUrlParser: true });
    User.insertMany(users, function(error, docs) {
      if (error) console.error(error);
      mongoose.connection.close(done);
    });
  });

  describe("Test Routes", function() {
    it("GET / Should get a 200 response", function(done) {
      client.get("/", function(err, req, res, obj) {
        assert.ifError(err);
        var resp = JSON.stringify(obj, null, 2);
        assert.equal(
          resp,
          '[\n  "POST    /login",\n  "GET     /user/:id",\n  "GET     /user/name/:name",\n  "GET     /policies/:name",\n  "GET     /policies/:number/user"\n]',
          "it is equal"
        );
      });
      done();
    });

    it("POST /login Should get a auth OK in response", function(done) {
      client.post(
        "/login",
        { email: "test1@gmail.com", password: "test123" },
        function(err, req, res, obj) {
          assert.ifError(err);
          assert.equal(obj["auth"], true, "Login ok");
        }
      );
      done();
    });

    it("User Test2 can access services according to their permission", function(done) {
      client.post(
        "/login",
        { email: "test2@gmail.com", password: "test123" },
        function(err, req, res, obj) {
          assert.ifError(err);
          var token = obj["token"];
          client.get(
            {
              path: "/user/a0ece5db-cd14-4f21-812f-966633e7be86",
              headers: { "x-access-token": token }
            },
            function(err, req, res, obj) {
              assert.equal(obj["role"], "admin");
            }
          );
          client.get(
            {
              path: "/user/name/britney",
              headers: { "x-access-token": token }
            },
            function(err, req, res, obj) {
              assert.equal(obj["role"], "admin");
            }
          );
        }
      );
      done();
    });

    it("User Test1 can access services according to their permission", function(done) {
      client.post(
        "/login",
        { email: "test1@gmail.com", password: "test123" },
        function(err, req, res, obj) {
          assert.ifError(err);
          var token = obj["token"];
          client.get(
            {
              path: "/policies/britney",
              headers: { "x-access-token": token }
            },
            function(err, req, res, obj) {
              assert.equal(obj.length, 102);
            }
          );
          client.get(
            {
              path: "/policies/64cceef9-3a01-49ae-a23b-3761b604800b/user",
              headers: { "x-access-token": token }
            },
            function(err, req, res, obj) {
              assert.equal(obj["email"], "manningblankenship@quotezart.com");
            }
          );
        }
      );
      done();
    });
  });

  after(function(done) {
    done();
  });
});
