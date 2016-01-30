'use strict';

angular.module('core.profile').controller('DisplayUserProfileController', ['$scope', '$state', 'Authentication', '$stateParams', '$http',
  function ($scope, $state, Authentication, $stateParams, $http) {
    $scope.authentication = Authentication;

    var path = '/api/users/' + $stateParams.userId;
    $http.get(path).success(function(data) {
      $scope.user = data;
    });
  }
]);



