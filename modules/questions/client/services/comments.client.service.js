'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('questions.comments').factory('Comments', ['$resource',
  function ($resource) {
    return $resource('api/questions/:questionId/comments', {
      questionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
