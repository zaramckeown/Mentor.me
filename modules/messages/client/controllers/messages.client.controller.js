'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
  function ($scope, $stateParams, $location, Authentication, Messages) {
    $scope.authentication = Authentication;

    // Create new Question
    $scope.create = function (messageId) {
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
        messageId: messageId
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

    $scope.formatDate = function (date) {
      var dateOut = new Date(date);
      return dateOut;
    };

    $scope.find = function (messageId) {
      $scope.showMessages = Messages.messageByIdLookUp.get({
        messageId: messageId
      });
    };

    // Find a list of messages for user
    $scope.findMessages = function () {
      $scope.messages = Messages.lookup.query(function(data) {
        if ($stateParams.userId !== "") {
          $scope.showMessages = Messages.messageByIdLookUp.get({
            messageId: $stateParams.userId
          });
        }
        else{
          var convoId;

          for (var count = 0; count < data.length; count++){
            convoId =  data[0]._id;
          }

          $scope.showMessages = Messages.messageByIdLookUp.get({
            messageId: convoId
          });
        }
      }, function(error) {
        console.log(error);
      });

    };
  }
]);
