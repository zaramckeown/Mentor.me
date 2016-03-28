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

  app.route('/api/recommendedMentor/:userId')
    .get(profilePolicy.isAllowed, profile.recommendedMentors);

  app.route('/api/points/:userId').post(profilePolicy.isAllowed, profile.points);

  app.route('/api/topMentor').get(profilePolicy.isAllowed, profile.topMentors);

  // Finish by binding the user middleware
  app.param('userId', profile.userByID);
};
