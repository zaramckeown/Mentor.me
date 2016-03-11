'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('core.profile').factory('Profile', ['$resource',
  function ($resource) {
    return {
      Users: $resource('api/users'),
      Search: $resource('api/search'),
      Messages: $resource('api/messages/create/:recipientId')
    };
  }
]);




