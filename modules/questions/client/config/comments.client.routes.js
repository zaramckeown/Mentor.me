'use strict';

// Setting up route
angular.module('questions.comments').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
    .state('comments.addComment', {
      url: '/:id/comments',
      templateUrl: 'modules/questions/client/views/view-question.client.view.html',
      controller: 'QuestionsController'
    });
  }
]);
