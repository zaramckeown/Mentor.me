'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HomeController'
    })
    .state('home.mentor', {
      url:'student',
      templateUrl: 'modules/core/client/views/mentor.client.view.html'
    })
    .state('home.student', {
      url:'mentor',
      templateUrl: 'modules/core/client/views/student.client.view.html'
    })
    .state('home.default', {
      url:'',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('contact', {
      url:'/contact',
      templateUrl: 'modules/core/client/views/contact.client.view.html'
    })
    .state('aboutus', {
      url:'/aboutus',
      templateUrl: 'modules/core/client/views/aboutus.client.view.html'
    })
    .state('not-found', {
    url: '/not-found',
    templateUrl: 'modules/core/client/views/404.client.view.html',
    data: {
      ignoreState: true
    }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
