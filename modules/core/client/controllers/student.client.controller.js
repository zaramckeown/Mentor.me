'use strict';

angular.module('core').controller('StudentController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $http.get('/api/recommendedMentor/'+$scope.authentication.user.id).then(function(successCallback) {

      $scope.mentors = successCallback.data;
    }, function(errorCallback) {

    });

    $http.get('/api/topMentor').then(function(successCallback) {
      $scope.topMentors = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $scope.passForQuestion = function() {

    };

    $scope.passForMentor = function() {

    };

    $http.get('/api/student/questions').then(function(successCallback) {

      $scope.newQuestions = successCallback.data;
    }, function(errorCallback) {

    });


  }
]);
