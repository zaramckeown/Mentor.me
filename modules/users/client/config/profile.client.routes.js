'use strict';

// Setting up route
angular.module('users.profile.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('profile', {
        abstract: true,
        url: '/mentorSearch',
        template: '<ui-view/>'
      })
      .state('profile.search', {
        url: '/mentorSearch',
        templateUrl: 'modules/users/client/views/profile/profile.client.view.html',
        controller: 'MentorListController'
      })
      .state('profile.view', {
        url: '/users/:userId/profile',
        templateUrl: '/modules/users/client/views/profile/view-profile.client.view.html',
        controller: 'DisplayUserProfileController'
      });
  }
]);

/*

resolve: {
  userResolve: ['$stateParams', '$http', function ($stateParams, $http) {
    var path = '/api/users/' + $stateParams.userId;
    console.log($stateParams);
    $http.get(path)
      .then(function(response) {
        return response.data;
      });
  }]
}*/
