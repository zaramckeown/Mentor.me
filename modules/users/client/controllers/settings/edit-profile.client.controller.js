'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    $scope.eduD = {};
    $scope.eduD.sdt = [];
    $scope.eduD.edt = [];
    for (var i = 0; i < $scope.user.profile.education.length; i += 1) {
      $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[i].startDate) });
      $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[i].endDate) });
    }

    $scope.expD = {};
    $scope.expD.sdt = [];
    $scope.expD.edt = [];
    for (i = 0; i < $scope.user.profile.experience.length; i += 1) {
      $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[i].startDate) });
      $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[i].endDate) });
    }

    $scope.awardD = {};
    $scope.awardD.sdt = [];
    for (i = 0; i < $scope.user.profile.awards.length; i += 1) {
      $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[i].date) });
    }

    $scope.addNewEducation = function() {
      $scope.user.profile.education.push({ schoolName: '', description : '', startDate : new Date(), endDate : new Date(), courseTitle : '' });
      $scope.eduD.sdt.push({ dt : new Date($scope.user.profile.education[$scope.user.profile.education.length - 1].startDate) });
      $scope.eduD.edt.push({ dt : new Date($scope.user.profile.education[$scope.user.profile.education.length - 1].endDate) });
    };

    $scope.removeEducation = function(index) {
      $scope.user.profile.education.splice(index, 1);
      $scope.eduD.sdt.splice(index, 1);
      $scope.eduD.edt.splice(index, 1);
    };

    $scope.addNewExperience = function() {
      $scope.user.profile.experience.push({ company : '', description : '', startDate : new Date(), endDate : new Date() });
      $scope.expD.sdt.push({ dt : new Date($scope.user.profile.experience[$scope.user.profile.experience.length - 1].startDate) });
      $scope.expD.edt.push({ dt : new Date($scope.user.profile.experience[$scope.user.profile.experience.length - 1].endDate) });
    };

    $scope.removeExperience = function(index) {
      $scope.user.profile.experience.splice(index, 1);
      $scope.expD.sdt.splice(index, 1);
      $scope.expD.edt.splice(index, 1);
    };

    $scope.addNewAward = function() {
      $scope.user.profile.awards.push({ title : '', description : '', issuer : '', date : new Date() });
      $scope.awardD.sdt.push({ dt : new Date($scope.user.profile.awards[$scope.user.profile.awards.length - 1].date) });
    };

    $scope.removeAward = function(index) {
      $scope.user.profile.awards.splice(index, 1);
      $scope.awardD.sdt.splice(index, 1);
    };

    $scope.addNewInterest = function() {
      $scope.user.profile.interests.push({ item : '' });
    };

    $scope.removeInterest = function(index) {
      $scope.user.profile.interests.splice(index, 1);
    };

    $scope.addNewLink = function() {
      $scope.user.profile.links.push({ url : '' });
    };

    $scope.removeLink = function(index) {
      $scope.user.profile.links.splice(index, 1);
    };

    if ($scope.user.profile.education.length === 0) {
      $scope.addNewEducation();
    }

    if ($scope.user.profile.experience.length === 0) {
      $scope.addNewExperience();
    }

    if ($scope.user.profile.awards.length === 0) {
      $scope.addNewAward();
    }

    if ($scope.user.profile.interests.length === 0) {
      $scope.addNewInterest();
    }
    if ($scope.user.profile.links.length === 0) {
      $scope.addNewLink();
    }

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.profile.description = $scope.user.profile.description;
      user.profile.education = $scope.user.profile.education;
      user.profile.experience = $scope.user.profile.experience;
      user.profile.interests = $scope.user.profile.interests;
      user.profile.links = $scope.user.profile.links;
      user.profile.awards = $scope.user.profile.awards;

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
