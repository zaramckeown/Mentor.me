'use strict';

angular.module('core').controller('ContactFormController', ['$scope', '$http', '$mdToast', '$animate',
  function($scope, $http, $mdToast, $animate) {

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };

    $scope.sendMail = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'contactForm');
        return false;
      }

      var data = ({
        contactName : this.contactName,
        contactEmail : this.contactEmail,
        contactMsg : this.contactMsg
      });

      // Simple POST request example (passing data) :
      $http.post('/contact-form', data).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available

        // Clear form fields
        $scope.contactName = '';
        $scope.contactEmail = '';
        $scope.contactMsg = '';

        $mdToast.show(
          $mdToast.simple()
            .content('Thanks for your message ' + data.contactName + ' we will get back to you soon!')
            .position($scope.getToastPosition())
            .hideDelay(5000)
        );

      }).
      error(function(data, status, headers, config) {
          $scope.error = data.message;
      });

    };
  }
]);
