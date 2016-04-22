'use strict';

angular.module('core.profile').controller('DisplayUserProfileController', ['$scope', '$state', 'Authentication', '$stateParams', '$http', 'Profile', '$location',
  function ($scope, $state, Authentication, $stateParams, $http, Profile, $location) {
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

    $scope.sendMessage = function (userId) {

      $scope.messages = Profile.Messages.get({ recipientId: userId },
        function (successResponse) {
          var result = JSON.stringify($scope.messages);
          //console.log(Object.keys(result).length);

          if (Object.keys(result).length === 2) {
            var path = '/api/messages/create/' + userId;
            $http.post(path).then(function (success) {
              var messageId = success.data._id;
              $location.path('messages/' + messageId);
            }, function (error) {
              console.log(error);
            });
          }
          else {
            //console.log(successResponse);
            var messageId = successResponse._id;
            $location.path('messages/' + messageId);
          }
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );
    };
  }
]);



