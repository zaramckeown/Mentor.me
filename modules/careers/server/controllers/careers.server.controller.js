'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Careers = mongoose.model('Careers'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var career = new Careers(req.body);
  career.user = req.user;

  career.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(career);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.career);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var career = req.career;

  career.title = req.body.title;
  career.content = req.body.content;

  career.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(career);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var career = req.career;

  career.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(career);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Careers.find().sort('-created').populate('user', 'displayName').exec(function (err, careers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(careers);
    }
  });
};

/**
 * Article middleware
 */
exports.careerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Career is invalid'
    });
  }

  Careers.findById(id).populate('user', 'displayName').exec(function (err, careers) {
    if (err) {
      return next(err);
    } else if (!careers) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.career = careers;
    next();
  });
};
