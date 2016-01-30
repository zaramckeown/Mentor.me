'use strict';

//Articles service used for communicating with the articles REST endpoints

angular.module('questions.comments').factory('Comments', ['$resource',
  function ($resource) {
    return $resource('api/questions/:id/comments', {
      update: {
        method: 'PUT'
      }
    });
  }
]);
