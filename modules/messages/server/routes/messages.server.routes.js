'use strict';

/**
 * Module dependencies.
 */
var messagesPolicy = require('../policies/messages.server.policy'),
  messages = require('../controllers/messages.server.controller');

module.exports = function (app) {

  app.route('/api/messages/:userId').all(messagesPolicy.isAllowed)
    .get(messages.list);

  app.route('/api/messages')
    .get(messages.findAllMessagesForUser);
};
