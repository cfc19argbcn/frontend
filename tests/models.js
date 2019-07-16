var mongoose = require("mongoose");
var User = require("../models/user");
var config = require("../config");
var users = require("../models/users.json");
var assert = require("chai").assert;

process.env.NODE_ENV = "test";

describe("Connection Model", function() {
  before(function(done) {
    mongoose.connect(config.database.test.uri, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", function() {
      console.log("We are connected to test database!");
      done();
    });
  });

  describe("Test Database", function() {
    it("Insert many user to database", function(done) {
      User.insertMany(users, function(error, docs) {
        if (error) console.error(error);
        assert.equal(docs.length, 2, "Name value has a length of 1");
        done();
      });
    });

    it("New name saved to test database", function(done) {
      var testName = User({
        name: "Luis",
        role: "admin",
        email: "lm@admin.com",
        password: "test"
      });

      testName.save(done);
      assert.equal(testName.name, "Luis", "The name is correct");
    });

    it("Dont save incorrect format to database", function(done) {
      var wrongSave = User({
        notName: "Not Luis"
      });
      wrongSave.save(done);
      assert.equal(wrongSave.name, undefined);
    });

    it("Should retrieve data from test database", function(done) {
      User.find({ name: "Luis" }, (err, name) => {
        if (err) {
          throw err;
        }
        if (name.length === 0) {
          throw new Error("No data!");
        }
        assert.equal(name.length, 1, "Name value has a length of 1");
        done();
      });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connection.close(done);
    });
  });
});
