'use strict';

// Articles controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
  function ($scope, $stateParams, $location, Authentication, Messages) {
    $scope.authentication = Authentication;

  }
]);
