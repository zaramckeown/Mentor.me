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

exports.upvote = function (req, res) {

  var user = req.user;
  var questionId = req.params.questionId;

  Question.findById(questionId).exec(function (err, question) {
    if (err) {
      return err;
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }

    for (var i=0; i<question.usersWhoUpvoted.length; i++){
      if (question.usersWhoUpvoted === user._id)
      {
        return res.status(400).send({
          message: "You have already up voted this question"
        });
      }
    }

    question.usersWhoUpvoted.push(user._id);
    question.upvotes = +1;
    question.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(question);
      }
    });
  });
};

exports.downvote = function (req, res) {
  var question = req.question;


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
  comment.user = req.user;

  comment.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }

    Question.findById(req.body.question._id).exec(function (err, question) {
      if (err) {
        return err;
      } else if (!question) {
        return res.status(404).send({
          message: 'No question with that identifier has been found'
        });
      }
      question.comments.push(comment);
      question.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
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
 * Update a question
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
 * question middleware
 */

exports.commentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'comment is invalid'
    });
  }
};

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
