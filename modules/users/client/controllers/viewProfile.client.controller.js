'use strict';

angular.module('core.profile').controller('DisplayUserProfileController', ['$scope', '$state', 'Authentication', '$stateParams', '$http',
  function ($scope, $state, Authentication, $stateParams, $http) {
    $scope.authentication = Authentication;

    var path = '/api/users/' + $stateParams.userId;
    $http.get(path).success(function(data) {
      $scope.user = data;

      $scope.eduD = {};
      $scope.eduD.sdt = [];
      $scope.eduD.edt = [];

      for (var i = 0; i < $scope.user.profile.education.length; i += 1) {
        $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[i].startDate) });
        $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[i].endDate) });
      }

      $scope.expD = {};
      $scope.expD.sdt = [];
      $scope.expD.edt = [];
      for (i = 0; i < $scope.user.profile.experience.length; i += 1) {
        $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[i].startDate) });
        $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[i].endDate) });
      }

      $scope.awardD = {};
      $scope.awardD.sdt = [];
      for (i = 0; i < $scope.user.profile.awards.length; i += 1) {
        $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[i].date) });
      }
    });
  }
]);



