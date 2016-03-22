'use strict';

/**
 * Module dependencies.
 */
var messagesPolicy = require('../policies/messages.server.policy'),
  messages = require('../controllers/messages.server.controller');

module.exports = function (app) {

  app.route('/api/messages').all(messagesPolicy.isAllowed)
    .get(messages.findAllMessagesForUser)
    .post(messages.appendMessage);

  app.route('/api/messages/:messageId').all(messagesPolicy.isAllowed)
    .get(messages.displayMessage)
    .post(messages.removeMessage);

  app.route('/api/messages/create/:recipientId').all(messagesPolicy.isAllowed)
    .get(messages.list)
    .post(messages.create);

};
