'use strict';

// Setting up route
angular.module('careers').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('careers', {
        abstract: true,
        url: '/careers',
        template: '<ui-view/>'
      })
      .state('careers.list', {
        url: '',
        templateUrl: 'modules/careers/client/views/list-careers.client.view.html'
      })
      .state('careers.create', {
        url: '/create',
        templateUrl: 'modules/careers/client/views/create-careers.client.view.html',
        data: {
          roles: ['student', 'mentor']
        }
      })
      .state('careers.view', {
        url: '/:careersId',
        templateUrl: 'modules/careers/client/views/view-careers.client.view.html'
      })
      .state('careers.edit', {
        url: '/:careersId/edit',
        templateUrl: 'modules/careers/client/views/edit-careers.client.view.html',
        data: {
          roles: ['student', 'mentor']
        }
      });
  }
]);
