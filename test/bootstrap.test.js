
(function() {
  var Sails, options, sails;

  Sails = require('sails');

  sails = void 0;

  global.request = require('supertest-as-promised');

  global.should = require('chai').should();

  global.moment = require('moment');

  global.sinon = require('sinon');

  // global.config = require('./resources/config');

  options = {
    loose: "all",
    stage: 1,
    ignore: null,
    only: null,
    extensions: null
  };

  // require("sails-hook-babel/node_modules/babel/register")(options);

  // require("babel-register");

  require("babel-core/register");
  require("babel-polyfill");

  before(function(done) {
    Sails.lift({
      environment: 'process.env.NODE_ENV' | 'test',
      port: 1338,
      hooks: {
        grunt: false
      }
    }, function(err, server) {
      sails = server;
      if (err) {
        return done(err);
      }
      done(err, sails);
    });
  });

  after(function(done) {
    sails.lower(done());
  });

}).call(this);
