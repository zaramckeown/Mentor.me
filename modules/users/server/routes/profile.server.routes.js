'use strict';

/**
 * Module dependencies
 */
var profile = require('../controllers/profile.server.controller');

module.exports = function (app) {

  app.route('/api/mentorSearch').get(profile.list);

  // Setting up the users profile api
  app.route('/api/users/:userId/profile').get(profile.read);

  // Users collection routes
  app.route('/api/users')
    .get(profile.list);


  // Finish by binding the user middleware
  app.param('userId', profile.userByID);
};
