'use strict';

// Setting up route
angular.module('messages').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/messages/:userId',
        template: '<ui-view/>'
      })
      .state('messages.create', {
        url: '/create',
        templateUrl: 'modules/messages/client/views/messages.client.view.html',
        data: {
          roles: ['student','mentor', 'admin']
        }
      })
      .state('messages.view', {
        url: '/:messageId',
        templateUrl: 'modules/messages/client/views/messages.client.view.html'
      })
      .state('messages.list', {
        url: '',
        templateUrl: 'modules/messages/client/views/messages.client.view.html'
      });
  }
]);
