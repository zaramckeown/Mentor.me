'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    $scope.user.profile.education = [];
    $scope.user.profile.experience = [];
    $scope.user.profile.awards = [];
    $scope.user.profile.interests = [];
    $scope.user.profile.links = [];

    $scope.addNewEducation = function() {
      $scope.user.profile.education.push({ schoolName: '', description : '', startDate : '', endDate : '', courseTitle : '' });
    };

    $scope.addNewExperience = function() {
      $scope.user.profile.experience.push({ company : '', description : '', startDate : '', endDate : '' });
    };

    $scope.addNewAward = function() {
      $scope.user.profile.awards.push({ title : '', description : '', issuer : '', date : '' });
    };

    $scope.addNewInterest = function() {
      $scope.user.profile.interests.push('');
    };

    $scope.addNewLink = function() {
      $scope.user.profile.links.push('');
    };

    $scope.addNewEducation();
    $scope.addNewExperience();
    $scope.addNewAward();
    $scope.addNewInterest();
    $scope.addNewLink();

    console.log($scope.user.profile);

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);
