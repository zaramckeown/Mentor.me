'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages', '$filter', '$http', '$window',
  function ($scope, $stateParams, $location, Authentication, Messages, $filter, $http, $window) {
    $scope.authentication = Authentication;

    // Create new Message
    $scope.create = function (convoId, isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messageForm');
        return false;
      }

      // Create new Message object
      var message = new Messages.lookup({
        content: this.content,
        conversationId: convoId
      });

      // Redirect after save
      message.$save(function (response) {
        $scope.showMessages = Messages.messageByIdLookUp.get({
          messageId: convoId
        });
        $location.path('messages/');

        // Clear form fields
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.authentication.user.id);
      }
    };

    $scope.removeConvo = function (message) {
      $http.post('/api/messages/' + message._id).then(
        function (response) {
          for (var i = 0; i < $scope.messages.length; i++) {
            if ($scope.messages[i]._id === message._id) {
              $scope.messages.splice([i], 1);

              $scope.showMessages = Messages.messageByIdLookUp.get({
                messageId: $scope.messages[0]._id
              });
            }
          }
        },
        function (response) {
          $scope.error = response.message;
        }
      );
    };

    $scope.find = function (messageId) {

      $scope.showMessages = Messages.messageByIdLookUp.get({
        messageId: messageId
      });
    };

    $scope.formatDate = function (date) {
      var dateOut = new Date(date);
      return dateOut;
    };

    // Find a list of messages for user
    $scope.findMessages = function () {
      $scope.messages = Messages.lookup.query(function(data) {

        if ($stateParams.userId !== "") {
          $scope.showMessages = Messages.messageByIdLookUp.get({
            messageId: $stateParams.userId
          });

          if (!data[0].messages.length) {
            $scope.content = "Below is a potential template to initiate the conversation: \n\nHi ______, \n\nMy name" +
              " is" +
              " _________. I am" +
              " currently" +
              " studying ______" +
              " at _______." +
              " \n" +
              "I am wondering  if you could help me with ____________. \n\nThanks, \n_______.";
          }
        }
        else {

          if ($scope.messages.length !== 0) {
            var convoId;

            for (var count = 0; count < data.length; count++){
              convoId = data[0]._id;
              if (!data[0].messages.length) {
                $scope.content = "Below is a potential template to initiate the conversation: \n\nHi ______, \n\nMy name" +
                  " is" +
                  " _________. I am" +
                  " currently" +
                  " studying ______" +
                  " at _______." +
                  " \n" +
                  "I am wondering  if you could help me with ____________. \n\nThanks, \n_______.";
              }
            }

            $scope.showMessages = Messages.messageByIdLookUp.get({
              messageId: convoId
            });

          }
          else{

            $scope.messages = null;
            $scope.showMessages = null;
          }
        }
      }, function(error) {
        console.log(error);
      });
    };
  }
]);
