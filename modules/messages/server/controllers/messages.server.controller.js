'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Messages = mongoose.model('Messages'),
  Conversations = mongoose.model('Conversations'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a question
 */
exports.create = function (req, res) {
  var conversations = new Conversations();
  conversations.sender = req.user;

  //needs to be a recipient Id passed
  conversations.recipient = req.params.recipientId;
  conversations.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(conversations);
    }
  });
};

exports.list = function (req, res) {
  Conversations.findOne({ sender: req.user._id, recipient:req.params.recipientId }).exec(function (err, conversations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (conversations)
      {
        if (conversations.recipientDeleted !== false || conversations.senderDeleted !== false) {
          conversations.recipientDeleted = false;
          conversations.senderDeleted = false;
          conversations.save(function (error) {
            if (error) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(error)
              });
            }
          });
        }
      }
      res.json(conversations);
    }
  });
};

exports.findAllMessagesForUser = function (req, res) {

  Conversations.find({ $or : [{ $and : [{ recipient : req.user._id }, { recipientDeleted : { $ne: true } }, { 'messages.0': { $exists: true } } ] }, { $and : [ { sender : req.user._id }, { senderDeleted : { $ne: true } } ] } ] }).deepPopulate('messages,sender, recipient, messages.sender').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!messages) {
      return res.status(404).send({
        message: 'No recipient with that identifier has been found'
      });
    }
    res.json(messages);
  });
};

exports.displayMessage = function (req, res) {
  Conversations.findById(req.params.messageId).deepPopulate('messages, messages.sender').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!messages) {
      return res.status(404).send({
        message: 'No Convo with that identifier has been found'
      });
    }
    res.json(messages);
  });
};

exports.removeMessage = function(req, res) {

  Conversations.findById(req.params.messageId).deepPopulate('messages, messages.sender').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!messages) {
      return res.status(404).send({
        message: 'No Convo with that identifier has been found'
      });
    }

    if (messages.sender.equals(req.user._id)) {
      messages.senderDeleted = true;
    }
    else{
      messages.recipientDeleted = true;
    }

    messages.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(messages);
    });
  });
};

exports.appendMessage = function (req, res) {
  var conversation_id = req.body.conversationId;

  var message = new Messages(req.body);
  message.sender = req.user;
  message.save(function (error) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      res.json(message);
    }
  });

  Conversations.findById(conversation_id).exec(function (error, conversation) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    }
    conversation.messages.push(message);
    conversation.save(function (error) {
      if (error) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(error)
        });
      }
    });
  });
};
