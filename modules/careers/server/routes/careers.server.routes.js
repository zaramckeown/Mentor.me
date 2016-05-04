'use strict';

/**
 * Module dependencies.
 */
var careersPolicy = require('../policies/careers.server.policy'),
  careers = require('../controllers/careers.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/careers').all(careersPolicy.isAllowed)
    .get(careers.list)
    .post(careers.create);

  // Single article routes
  app.route('/api/careers/:careerId').all(careersPolicy.isAllowed)
    .get(careers.read)
    .put(careers.update)
    .delete(careers.delete);

  // Finish by binding the article middleware
  app.param('careerId', careers.careerByID);
};
