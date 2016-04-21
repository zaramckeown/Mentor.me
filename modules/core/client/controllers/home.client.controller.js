'use strict';
new WOW().init();
angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state',
  function ($scope, Authentication, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    if ($scope.authentication.user !== "") {

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $state.go('home.mentor');
      }

      if ($scope.authentication.user.roles[0] === 'student') {
        $state.go('home.student');
      }
    }
    else {
      $state.go('home.default');
    }
  }
]);
