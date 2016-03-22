'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages', '$filter', '$http',
  function ($scope, $stateParams, $location, Authentication, Messages, $filter, $http) {
    $scope.authentication = Authentication;

    // Create new Message
    $scope.create = function (messageId) {

      // Create new Message object
      var message = new Messages.lookup({
        created: new Date(),
        content: this.content,
        messageId: messageId
      });

      // Redirect after save
      message.$save(function (response) {
        $scope.showMessages = Messages.messageByIdLookUp.get({
          messageId: messageId
        });
        $location.path('messages/');

        // Clear form fields
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.removeConvo = function (message) {
      $http.post('/api/messages/' + message._id).then(function successCallback(response) {
        $scope.messages = response;
      }, function errorCallback(response) {
        console.log(response);
      });
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
        }
        else {

          if ($scope.messages.length !== 0) {
            var convoId;

            for (var count = 0; count < data.length; count++){
              convoId = data[0]._id;
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
