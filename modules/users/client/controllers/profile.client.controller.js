'use strict';

angular.module('core.profile').controller('MentorListController', ['$scope', '$filter', 'Profile',
  function ($scope, $filter, Profile) {
    Profile.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);

      var placeholderSchool = [];
      for(var usercounter =0; usercounter<$scope.users.length; usercounter++)
      {
        $scope.schoolmodel = [];
        for(var i=0; i<$scope.users[usercounter].profile.education.length; i++)
        {
          placeholderSchool.push({ id: $scope.users[usercounter].profile.education[i].schoolName, label: $scope.users[usercounter].profile.education[i].schoolName });
        }

        $scope.schooldata = placeholderSchool;}
    };
    $scope.schoolsettings = { enableSearch: true };
    $scope.schooltext = { buttonDefaultText: 'Search by School', dynamicButtonTextSuffix: 'Search by School' };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);
