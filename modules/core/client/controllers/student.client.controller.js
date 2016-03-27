'use strict';

angular.module('core').controller('StudentController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $http.get('/api/recommendedMentor/'+$scope.authentication.user.id).then(function(successCallback) {

      $scope.mentors = successCallback.data;
    }, function(errorCallback) {

    });

  }
]);
