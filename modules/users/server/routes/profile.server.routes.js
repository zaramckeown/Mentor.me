'use strict';

/**
 * Module dependencies
 */
var profile = require('../controllers/profile.server.controller');

module.exports = function (app) {

  app.route('/api/users').get(profile.list);

  app.route('/api/search').get(profile.search);

  // Setting up the users profile api
  app.route('/api/users/:userId/profile').get(profile.read);

  // Finish by binding the user middleware
  app.param('userId', profile.userByID);
};
