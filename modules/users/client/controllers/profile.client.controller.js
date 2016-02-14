'use strict';

angular.module('core.profile').controller('MentorListController', ['$scope', '$filter', 'Profile',
  function ($scope, $filter, Profile) {

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

      /*var placeholderSchool = [];
      for(var usercounter =0; usercounter<$scope.users.length; usercounter++)
      {
        for(var i=0; i<$scope.users[usercounter].profile.education.length; i++)
        {
          placeholderSchool.push({ id: $scope.users[usercounter].profile.education[i].schoolName, label: $scope.users[usercounter].profile.education[i].schoolName });
        }

        $scope.schooldata = placeholderSchool;
      }*/

    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);
