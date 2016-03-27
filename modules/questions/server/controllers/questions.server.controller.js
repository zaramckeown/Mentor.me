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
 * Create a question
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

/**
 * up vote a question
 */
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
    
    question.usersWhoUpvoted.push(user._id);
    question.upvotes+=1;

    for (var i=0; i<question.usersWhoDownvoted.length; i++){
      if (question.usersWhoDownvoted[i].equals(user._id)) {
        question.usersWhoDownvoted.splice(i, 1);        
        question.downvotes -= 1;
        break;
      }
    }

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

/**
 * down vote a question
 */
exports.downvote = function (req, res) {
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

    question.usersWhoDownvoted.push(user._id);
    question.downvotes +=1;

    for (var i=0; i<question.usersWhoUpvoted.length; i++){
      if (question.usersWhoUpvoted[i].equals(user._id)) {
        question.usersWhoUpvoted.splice(i, 1);
        question.upvotes -= 1;
        break;
      }
    }

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

/**
 * up vote a answer
 */

exports.upvoteComment = function (req, res) {
  var user = req.user;
  var commentId = req.params.commentId;
    
  Comments.findById(commentId).exec(function (err, comments) {
    if (err) {
      return err;
    } else if (!comments) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }

    comments.usersWhoUpvoted.push(user._id);
    comments.upvotes +=1;

    for (var i=0; i<comments.usersWhoDownvoted.length; i++){
      if (comments.usersWhoDownvoted[i].equals(user._id)) {
        comments.usersWhoDownvoted.splice(i, 1);
        comments.downvotes -= 1;
        break;
      }
    }

    comments.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comments);
      }
    });
  });
};

/**
 * down vote a answer
 */
exports.downvoteComment = function (req, res) {
  var user = req.user;
  var commentId = req.params.commentId;
    
  // ADD comment downvote code here
  Comments.findById(commentId).exec(function (err, comment) {
    if (err) {
      return err;
    } else if (!comment) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }

    comment.usersWhoDownvoted.push(user._id);
    comment.downvotes +=1;

    for (var i=0; i<comment.usersWhoUpvoted.length; i++){
      if (comment.usersWhoUpvoted[i].equals(user._id)) {
        comment.usersWhoUpvoted.splice(i, 1);
        comment.upvotes -= 1;
        break;
      }
    }

    comment.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comment);
      }
    });
  });
};

/**
 * Create a comment
 */
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
 * Show the current question
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
 * Delete an question
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
  Question.find().sort({ upvotes: -1, created: -1 }).deepPopulate('user, displayName, comments, comments.user').exec(function (err, question) {
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

/*
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
    Question.findById(id).deepPopulate('comments', { populate: { } }).exec(function (err, comments) {
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

  Question.findById(id).deepPopulate('user comments comments.user', { populate: { } }).exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }
    req.question = question;
    next();
  });
};

exports.mentor = function(req, res) {
  Question.find().sort({ created: -1 }).exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

exports.students = function (req, res) {
  Question.find().sort({ "comments.created": -1, "created": -1 }).deepPopulate('user, comments, comments.user').exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};
