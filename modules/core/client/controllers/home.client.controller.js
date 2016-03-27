'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state',
  function ($scope, Authentication, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    if ($scope.authentication.user.roles[0] === 'mentor') {
      $state.go('home.mentor');
    }

    if ($scope.authentication.user.roles[0] === 'student') {
      $state.go('home.student');
    }

    if (!$scope.authentication) {
      $state.go('home.default');
    }
  }
]);
