'use strict';

/**
 * Module dependencies.
 */
var questionsPolicy = require('../policies/questions.server.policy.js'),
  questions = require('../controllers/questions.server.controller.js');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/questions').all(questionsPolicy.isAllowed)
    .get(questions.list)
    .post(questions.create);

  // Single article routes
  app.route('/api/questions/:questionId').all(questionsPolicy.isAllowed)
    .get(questions.read)
    .put(questions.update)
    .delete(questions.delete);

  app.route('/api/questions/:id/comments')
    .post(questions.addComment);

  // Finish by binding the article middleware
  app.param('questionId', questions.questionByID);
};
