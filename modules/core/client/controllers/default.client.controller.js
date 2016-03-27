'use strict';

angular.module('core').controller('DefaultController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


  }
]);
