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
  //req.params.id or something similar
  var message = new Messages(req.body);
  var conversations = new Conversations();
  message.save(function (err) {
    if (err) {
      return res.status(400).send({
       // message: errorHandler.getErrorMessage(err)
      });
    } else {
     //res.json(question);
    }
  });

  conversations.sender = req.body.sender;
  conversations.recipient = req.body.recipient;
  conversations.message = message._id;
  conversations.save(function (err) {
    if (err) {
      return res.status(400).send({
        // message: errorHandler.getErrorMessage(err)
      });
    } else {
      //res.json(question);
    }
  });

 /* Conversations.findOne({ sender: req.body.sender, recipient: req.body.recipient}, function(error, conversations) {
    if (error) {
     // return handleError(error);
    }
    console.log(conversations);
  });*/

};

exports.list = function (req, res) {
  Conversations.findOne({ sender: req.params.userId, recipient: req.user }).exec(function (err, conversations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(conversations);
    }
  });
};

exports.findAllMessagesForUser = function (req, res) {

  //amend to also include reciever
  Conversations.find({ sender: req.user._id }).deepPopulate('messages', 'sender', 'recipient').exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};
