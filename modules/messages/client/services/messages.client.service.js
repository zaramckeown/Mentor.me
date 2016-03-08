'use strict';

angular.module('messages').factory('Messages', ['$resource',
  function ($resource) {
    return {
      lookup: $resource('api/messages', {
      }, {
        update: {
          method: 'PUT'
        }
      }),
      messageByIdLookUp: $resource('/api/messages/:messageId',{
        messageId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
  }
]);
