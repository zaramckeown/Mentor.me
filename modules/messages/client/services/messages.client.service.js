'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('messages').factory('Messages', ['$resource',
  function ($resource) {
    return $resource('api/messages/:messageId', {
      messageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
