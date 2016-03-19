'use strict';

angular.module('core.profile').controller('MentorListController', ['$scope', '$filter', 'Profile', '$http', '$location',
  function ($scope, $filter, Profile, $http, $location) {

    Profile.Users.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.searchParams = {};
    $scope.availableSearchParams = [
      { key: "firstname", name: "Firstname", placeholder: "Name..." },
      { key: "location", name: "Location", placeholder: "Location..." },
      { key: "education", name: "Education", placeholder: "Education..." },
      { key: "experience", name: "Company", placeholder: "Company..." },
      { key: "interests", name: "Interest", placeholder: "Interest..." },
      { key: "helpswith", name: "Helps with", placeholder: "Helps with...", suggestedValues: ['cv', 'general advice', 'interviews'], restrictToSuggestedValues: true }
    ];
    $scope.$on('advanced-searchbox:enteredEditMode', function (event, searchParameter) {
      ///
    });

    $scope.$on('advanced-searchbox:leavedEditMode', function (event, searchParameter) {

    });

    $scope.$on('advanced-searchbox:modelUpdated', function (event, model) {

      Profile.Search.query(model, function(result)
      {
        $scope.users = result;
        $scope.buildPager();
      });
    });

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });

      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    $scope.sendMessage = function (userId) {

      $scope.messages = Profile.Messages.get({ recipientId: userId },
        function (successResponse) {
          var result = JSON.stringify($scope.messages);
          //console.log(Object.keys(result).length);

          if (Object.keys(result).length === 2) {
            var path = '/api/messages/create/' + userId;
            $http.post(path).then(function (success) {
              var messageId = success.data._id;
              $location.path('messages/' + messageId);
            }, function (error) {
              console.log(error);
            });
          }
          else {
            //console.log(successResponse);
            var messageId = successResponse._id;
            $location.path('messages/' + messageId);
          }
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );
    };
  }
]);
