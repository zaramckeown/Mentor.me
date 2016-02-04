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
  var message = new Messages(req.body);

  message.save(function (err) {
    if (err) {
      return res.status(400).send({
       // message: errorHandler.getErrorMessage(err)
      });
    } else {
     // res.json(question);
    }
  });

  Conversations.findOne({ sender: '', recipient:'' }, function(error, conversations) {
    if (error) {
     // return handleError(error);
    }
    console.log(conversations);
  });

  //look it up to see if it already exists by using the recipient id and the sender id
  //var conversation = new Conversations();

};
