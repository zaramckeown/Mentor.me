'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
  function ($scope, $stateParams, $location, Authentication, Messages) {
    $scope.authentication = Authentication;

    // Create new Question
    $scope.create = function () {
     // $scope.error = null;
/*
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'questionForm');
        return false;
      }*/

      // Create new Question object
      var message = new Messages.lookup({
        created: new Date(),
        content: this.content,
        recipient: $stateParams.userId
      });

      // Redirect after save
      message.$save(function (response) {
        $location.path('messages/' + response._id);

        // Clear form fields
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (question) {
      if (question) {
        question.$remove();

        for (var i in $scope.question) {
          if ($scope.question[i] === question) {
            $scope.question.splice(i, 1);
          }
        }
      } else {
        $scope.question.$remove(function () {
          $location.path('questions');
        });
      }
    };

    // Find a list of Articles
    $scope.find = function () {
      //$scope.messages = Messages.lookup.query();
    };

    // Find a list of messages for user
    $scope.findMessages = function () {
      $scope.messages = Messages.lookup.query();
    };
  }
]);
