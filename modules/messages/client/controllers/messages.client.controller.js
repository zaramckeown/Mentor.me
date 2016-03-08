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

    $scope.formatDate = function(date){
      var dateOut = new Date(date);
      return dateOut;
    };

    $scope.find = function (messageId) {
      $scope.showMessages = Messages.messageByIdLookUp.get({
        messageId: messageId
      });
      console.log($scope.showMessages);
    };

    // set the first question to the first to be automatically shown
    // when the message button is selected from profile that message needs to be shown in box


    // Find a list of messages for user
    $scope.findMessages = function () {
      $scope.messages = Messages.lookup.query();
    };
  }
]);
