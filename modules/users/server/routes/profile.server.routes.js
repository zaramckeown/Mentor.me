'use strict';

/**
 * Module dependencies
 */
var profile = require('../controllers/profile.server.controller');

module.exports = function (app) {

  app.route('/api/mentorSearch').get(profile.list);
};
