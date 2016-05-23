'use strict';

// Articles controller
angular.module('careers').controller('CareersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Careers', '$sce',
  function ($scope, $stateParams, $location, Authentication, Careers, $sce) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'careersForm');

        return false;
      }

      // Create new Article object
      var career = new Careers({
        title: this.title,
        content: this.content,
        link: this.link,
        company: this.company
      });

      // Redirect after save
      career.$save(function (response) {
        $location.path('careers/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.company = '';
        $scope.link = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (careers) {
      if (careers) {
        careers.$remove();

        for (var i in $scope.careers) {
          if ($scope.careers[i] === careers) {
            $scope.careers.splice(i, 1);
          }
        }
      } else {
        $scope.careers.$remove(function () {
          $location.path('careers');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'careersForm');

        return false;
      }

      var careers = $scope.careers;

      careers.$update(function () {
        $location.path('careers/' + careers._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.careers = Careers.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.careers = Careers.get({
        careersId: $stateParams.careersId
      });
    };

    $scope.redirect = function (link) {
      var substring = "http";
      if (link.indexOf(substring) > -1) {
        return $sce.trustAsResourceUrl(link);
      }
      else {
        link = "https://"+ link;
        return $sce.trustAsResourceUrl(link);
      }

    };
  }
]);
