'use strict';

// Setting up route
angular.module('messages').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/messages',
        template: '<ui-view/>'
      })
      .state('messages.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('messages.view', {
        url: '/:messageId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      });
  }
]);
