'use strict';

// Setting up route
angular.module('profile').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/mentorSearch',
        templateUrl: 'modules/users/client/views/profile/profile.client.view.html',
        controller: 'MentorListController'
      });
  }
]);
