'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('careers').factory('Careers', ['$resource',
  function ($resource) {
    return $resource('api/careers/:careersId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
