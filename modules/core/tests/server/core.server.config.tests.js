'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  fs = require('fs'),
  mock = require('mock-fs'),
  config = require(path.resolve('./config/config')),
  logger = require(path.resolve('./config/lib/logger')),
  seed = require(path.resolve('./config/lib/seed'));

/**
 * Globals
 */
var user1, admin1, userFromSeedConfig, adminFromSeedConfig, originalLogConfig;

describe('Configuration Tests:', function () {

  describe('Testing default seedDB', function () {
    before(function (done) {
      User.remove(function (err) {
        should.not.exist(err);

        user1 = {
          username: 'user_config_test',
          provider: 'local',
          email: 'user_config_test_@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          displayName: 'User Local',
          roles: ['student']
        };

        admin1 = {
          username: 'admin_config_test',
          provider: 'local',
          email: 'admin_config_test_@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          displayName: 'Admin Local',
          roles: ['student', 'mentor']
        };

        userFromSeedConfig = config.seedDB.options.seedUser;
        adminFromSeedConfig = config.seedDB.options.seedAdmin;

        return done();

      });
    });

    after(function (done) {
      User.remove(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    describe('Testing Session Secret Configuration', function () {
      it('should warn if using default session secret when running in production', function (done) {
        var conf = { sessionSecret: 'MEAN' };
        // set env to production for this test
        process.env.NODE_ENV = 'production';
        config.utils.validateSessionSecret(conf, true).should.equal(false);
        // set env back to test
        process.env.NODE_ENV = 'test';
        return done();
      });

      it('should accept non-default session secret when running in production', function () {
        var conf = { sessionSecret: 'super amazing secret' };
        // set env to production for this test
        process.env.NODE_ENV = 'production';
        config.utils.validateSessionSecret(conf, true).should.equal(true);
        // set env back to test
        process.env.NODE_ENV = 'test';
      });

      it('should accept default session secret when running in development', function () {
        var conf = { sessionSecret: 'MEAN' };
        // set env to development for this test
        process.env.NODE_ENV = 'development';
        config.utils.validateSessionSecret(conf, true).should.equal(true);
        // set env back to test
        process.env.NODE_ENV = 'test';
      });

      it('should accept default session secret when running in test', function () {
        var conf = { sessionSecret: 'MEAN' };
        config.utils.validateSessionSecret(conf, true).should.equal(true);
      });
    });

    describe('Testing Logger Configuration', function () {

      beforeEach(function () {
        originalLogConfig = _.clone(config.log, true);
        mock();
      });

      afterEach(function () {
        config.log = originalLogConfig;
        mock.restore();
      });

      it('should retrieve the log format from the logger configuration', function () {
        config.log = {
          format: 'tiny'
        };

        var format = logger.getFormat();
        format.should.be.equal('tiny');
      });

      it('should retrieve the log options from the logger configuration', function () {
        config.log = {
          options: {
            _test_log_option_: 'testing'
          }
        };

        var options = logger.getOptions();
        should.deepEqual(options, config.log.options);
      });

      it('should verify that a writable stream was created using the logger configuration', function () {
        var _dir = process.cwd();
        var _filename = 'unit-test-access.log';

        config.log = {
          options: {
            stream: {
              directoryPath: _dir,
              fileName: _filename
            }
          }
        };

        var options = logger.getOptions();
        options.stream.writable.should.equal(true);
      });

      it('should use the default log format of "combined" when an invalid format was provided', function () {
        // manually set the config log format to be invalid
        config.log = {
          format: '_some_invalid_format_'
        };

        var format = logger.getFormat();
        format.should.be.equal('combined');
      });

      it('should remove the stream option when an invalid filename was supplied for the log stream option', function () {
        // manually set the config stream fileName option to an empty string
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: process.cwd(),
              fileName: ''
            }
          }
        };

        var options = logger.getOptions();
        should.not.exist(options.stream);
      });

      it('should remove the stream option when an invalid directory path was supplied for the log stream option', function () {
        // manually set the config stream fileName option to an empty string
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: '',
              fileName: 'test.log'
            }
          }
        };

        var options = logger.getOptions();
        should.not.exist(options.stream);
      });

      it('should confirm that the log directory is created if it does not already exist', function () {
        var _dir = process.cwd() + '/temp-logs';
        var _filename = 'unit-test-access.log';

        // manually set the config stream fileName option to an empty string
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: _dir,
              fileName: _filename
            }
          }
        };

        var options = logger.getOptions();
        options.stream.writable.should.equal(true);
      });

      it('should remove the stream option when an invalid filename was supplied for the rotating log stream option', function () {
        // enable rotating logs
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: process.cwd(),
              rotatingLogs: {
                active: true,
                fileName: '',
                frequency: 'daily',
                verbose: false
              }
            }
          }
        };

        var options = logger.getOptions();
        should.not.exist(options.stream);
      });

      it('should confirm that the rotating log is created using the logger configuration', function () {
        var _dir = process.cwd();
        var _filename = 'unit-test-rotating-access-%DATE%.log';

        // enable rotating logs
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: _dir,
              rotatingLogs: {
                active: true,
                fileName: _filename,
                frequency: 'daily',
                verbose: false
              }
            }
          }
        };

        var options = logger.getOptions();
        should.exist(options.stream.write);
      });

      it('should confirm that the rotating log directory is created if it does not already exist', function () {
        var _dir = process.cwd() + '/temp-rotating-logs';
        var _filename = 'unit-test-rotating-access-%DATE%.log';

        // enable rotating logs
        config.log = {
          format: 'combined',
          options: {
            stream: {
              directoryPath: _dir,
              rotatingLogs: {
                active: true,
                fileName: _filename,
                frequency: 'daily',
                verbose: false
              }
            }
          }
        };

        var options = logger.getOptions();
        should.exist(options.stream.write);
      });
    });
  });
});
