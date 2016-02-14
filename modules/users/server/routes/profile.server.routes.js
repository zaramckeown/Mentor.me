'use strict';

/**
 * Module dependencies
 */
var profile = require('../controllers/profile.server.controller'),
  profilePolicy = require('../policies/profile.server.policy');

module.exports = function (app) {

  app.route('/api/users').get(profilePolicy.isAllowed, profile.list);

  app.route('/api/search').get(profilePolicy.isAllowed, profile.search);

  // Setting up the users profile api
  app.route('/api/users/:userId').get(profilePolicy.isAllowed, profile.read);

  // Finish by binding the user middleware
  app.param('userId', profile.userByID);
};
