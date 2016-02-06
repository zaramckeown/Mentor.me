'use strict';

angular.module('users').controller('ChangeRole', ['$scope', '$timeout', '$window', 'Authentication', 'Users',
  function ($scope, $timeout, $window, Authentication, Users) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function () {
      var user = new Users($scope.user);
      user.roles = "mentor";

      user.$update(function (response) {
        Authentication.user = response;
        $window.location.href = '/settings/profile';
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.updateUserProfileRoleStudent = function () {
      var user = new Users($scope.user);
      user.roles = "student";

      user.$update(function (response) {
        Authentication.user = response;
        $window.location.href = '/settings/profile';

      }, function (response) {
        $scope.error = response.data.message;
      });
    };

  }
]);
