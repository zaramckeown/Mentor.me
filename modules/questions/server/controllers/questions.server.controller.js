'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Questions'),
  Comments = mongoose.model('Comments'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var question = new Question(req.body);
  question.user = req.user;

  question.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

exports.addComment = function (req, res) {
  var comment = new Comments(req.body);
  comment.question = req.question;
  comment.user = req.user;

  comment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }

    req.question.comments.push(comment);
    req.question.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.question);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var question = req.question;

  question.title = req.body.title;
  question.content = req.body.content;

  question.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var question = req.question;

  question.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * List of Articles

 exports.list = function (req, res) {
  Question.find().sort('-created').populate('user', 'displayName').exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};
 */

exports.list = function (req, res) {
  Question.find().populate('user', 'displayName').exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Article middleware
 */

exports.commentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'comment is invalid'
    });
  }
};


/*
exports.questionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'question is invalid'
    });
  }


  Question.findById(id).deepPopulate('user').exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }
    Question.findById(id).deepPopulate('user').exec(function (err, comments) {
      if (err) {
        return next(err);
      } else if (!comments) {
        return res.status(404).send({
          message: 'No question with that identifier has been found'
        });
      }
      req.question = question;
      console.log(req.question);
      next();
    });
  });
};
*/

exports.questionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'question is invalid'
    });
  }

  var questionData = { question: '', commentsSent: '' };

  Question.findById(id).deepPopulate('user').exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }
    Question.findById(id).deepPopulate('comments').exec(function (err, comments) {
      if (err) {
        return next(err);
      } else if (!comments) {
        return res.status(404).send({
          message: 'No question with that identifier has been found'
        });
      }
      questionData.question = question;
      questionData.commentsSent = comments;
      req.question = questionData;
      console.log(req.question);
      next();
    });
  });
};
