'use strict';

//Messages service used for communicating with the messages REST endpoints
/*angular.module('messages').factory('Messages', ['$resource',
  function ($resource) {
    return $resource('api/messages/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);*/

angular.module('messages').factory('Messages', ['$resource',
  function ($resource) {
    return {
      lookup: $resource('api/messages', {
      }, {
        update: {
          method: 'PUT'
        }
      }),
      countries: $resource('api/messages/:userId',{
        userId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
  }
]);
