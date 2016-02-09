'use strict';

// Questions controller
angular.module('questions').controller('QuestionsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments', 'Questions', 'ngDialog', '$window',
  function ($scope, $http, $stateParams, $location, Authentication, Comments, Questions, ngDialog, $window) {
    $scope.authentication = Authentication;
    $scope.currentUser = Authentication.user.id;

    // Create new Question
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'questionForm');
        return false;
      }

      // Create new Question object
      var question = new Questions({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      question.$save(function (response) {
        $location.path('questions/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.upvote = function (questionId) {

      var path = '/api/questions/' + questionId + '/upvote';
      $http.post(path);
      location.reload();
    };

    $scope.downvote = function (questionId) {
      var path = '/api/questions/' + questionId + '/downvote';
      $http.post(path);
      location.reload();
    };

    $scope.addComment = function () {
      var comment = new Comments({
        body: this.comment,
        question: this.question.question
      });

      if ($scope.comment === '') {
        return;
      }

      // Redirect after save
      comment.$save({ id: $stateParams.questionId }, function (response) {
        location.reload();
        // Clear form fields
        $scope.body = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (question) {
      if (question) {
        question.$remove();

        for (var i in $scope.question) {
          if ($scope.question[i] === question) {
            $scope.question.splice(i, 1);
          }
        }
      } else {
        $scope.question.$remove(function () {
          $location.path('questions');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'questionsForm');

        return false;
      }

      var question = $scope.question;

      question.$update(function () {
        $location.path('questions/' + question._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.questions = Questions.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.question = Questions.get({
        questionId: $stateParams.questionId
      },
        function (successResponse) {
          if (successResponse.question.usersWhoUpvoted.length > 0){
            $scope.upvotedOrNot = successResponse.question.usersWhoUpvoted.indexOf($scope.currentUser) === -1;
          }
          else{
            $scope.upvotedOrNot = -1;
          }

          if (successResponse.question.usersWhoDownvoted.length > 0){
            $scope.downvotedOrNot = successResponse.question.usersWhoDownvoted.indexOf($scope.currentUser) === -1;
          }
          else {
            $scope.downvotedOrNot = -1;
          }
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );
    };

    $scope.listQuestion = function () {
      $scope.questions = Questions.findAnswer({
        questionId: $stateParams.questionId
      });
    };
    $scope.alreadyVoted = function () {
      ngDialog.open({ template: 'firstDialogId' });
    };

    $scope.ownerQuestion = function () {
      ngDialog.open({ template: 'ownerQuestion' });
    };
  }
]);
