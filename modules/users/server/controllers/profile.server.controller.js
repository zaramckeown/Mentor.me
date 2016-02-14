'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -accessToken -refreshToken').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};

exports.search = function(req, res){

  var findQuery = {};

  if(req.query.helpswith) {

    if (req.query.helpswith === "cv") {
      findQuery['profile.helpsWith.cvChecked'] = true;
    }

    else if(req.query.helpswith === "general advice") {
      findQuery['profile.helpsWith.questionsChecked'] = true;
    }

    else if(req.query.helpswith === "interviews") {
      findQuery['profile.helpsWith.checkedInterviews'] = true;
    }
  }

  if (req.query.firstname) {
    findQuery.firstName = req.query.firstname;
  }

  if (req.query.experience) {
    findQuery['profile.experience.company'] = req.query.experience;
  }

  if (req.query.education) {
    findQuery['profile.education.schoolName'] = req.query.education;
  }

  if (req.query.interest) {
    findQuery['profile.interest.interest'] = req.query.interest;
  }

  if (req.query.location) {
    findQuery['profile.location'] = req.query.location;
  }

  //the query text also has to go in somewhere

  User.find(findQuery).populate('user', 'displayName').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -accessToken -refreshToken').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
