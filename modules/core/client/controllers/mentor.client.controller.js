'use strict';

angular.module('core').controller('MentorController', ['$scope', 'Authentication', '$http',
  function ($scope, Authentication, $http) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $http.get('/api/mentor/questions').then(function(successCallback) {
      $scope.newQuestions = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });

    $http.get('/api/messages').then(function(successCallback) {
      $scope.messages = successCallback.data;
    }, function (errorCallback) {
      console.log(errorCallback);
    });
  }
]);
