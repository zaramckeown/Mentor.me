'use strict';

// Questions controller
angular.module('questions').controller('QuestionsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments', 'Questions', 'ngDialog', '$filter',
  function ($scope, $http, $stateParams, $location, Authentication, Comments, Questions, ngDialog, $filter) {
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
      var currentQuestion = $scope.pagedItems;
      for (var i=0; i<$scope.pagedItems.length; i++)
      {
        if(currentQuestion[i]._id === questionId)
        {
          if (currentQuestion[i].user._id === $scope.currentUser) {
            $scope.ownerQuestion();
            return;
          }

          if (currentQuestion[i].usersWhoUpvoted.indexOf($scope.currentUser) === -1) {
            var path = '/api/questions/' + questionId + '/upvote';
            $http.post(path);
            location.reload();
          } else {
            $scope.alreadyVoted();
          }
        }
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    $scope.downvote = function (questionId) {
      var currentQuestion = $scope.pagedItems;

      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {

          if (currentQuestion[i].user._id === $scope.currentUser) {
            $scope.ownerQuestion();
            return;
          }

          if (currentQuestion[i].usersWhoDownvoted.indexOf($scope.currentUser) === -1) {
            var path = '/api/questions/' + questionId + '/downvote';
            $http.post(path);
            location.reload();
          } else {
            $scope.alreadyVoted();
          }
        }
      }
      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
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

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/' + $scope.currentUser);
      }
    };

    $scope.upvoteComment = function (questionId, commentId) {
      var currentQuestion = $scope.pagedItems;
      var comments = '';
      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {
          comments = currentQuestion[i].comments;
        }
      }
      // find comment here
      var commentIndex = -1;
      for (var index = 0; index < comments.length; index = index + 1) {
        if (comments[index]._id === commentId) {
          commentIndex = index;
          break;
        }
      }

      if (commentIndex === -1) {
        return;
      }

      var comment = comments[commentIndex];
      if (comment.user._id === $scope.currentUser) {
        $scope.ownerComment();
        return;
      }
      if (comment.usersWhoUpvoted.indexOf($scope.currentUser) === -1) {
        var path = '/api/questions/' + questionId + '/upvoteComments/' + commentId;
        $http.post(path);
        location.reload();
      } else {
        $scope.votedComment();
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
    };

    $scope.downvoteComment = function (questionId, commentId) {
      var currentQuestion = $scope.pagedItems;
      var comments = '';
      for (var i=0; i<$scope.pagedItems.length; i++) {
        if (currentQuestion[i]._id === questionId) {
          comments = currentQuestion[i].comments;
        }
      }
      
      // find comment here
      var commentIndex = -1;
      for (var index = 0; index < comments.length; index = index + 1) {
        if (comments[index]._id === commentId) {
          commentIndex = index;
          break;
        }
      }
      
      if (commentIndex === -1) {
        return;
      }
      
      var comment = comments[commentIndex];
      if (comment.user._id === $scope.currentUser) {
        $scope.ownerComment();
        return;
      }
      if (comment.usersWhoDownvoted.indexOf($scope.currentUser) === -1) {
        var path = '/api/questions/' + questionId + '/downvoteComments/' + commentId;
        $http.post(path);
        location.reload();    
      } else {
        $scope.votedComment();
      }

      if ($scope.authentication.user.roles[0] === 'mentor') {
        $http.post('/api/points/'+$scope.currentUser);
      }
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
/*
    // Find a list of all questions
    $scope.find = function () {
      $scope.questions = Questions.query();
      $scope.buildPager();
    };*/

    Questions.query(function (data) {
      $scope.questions = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 4;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.questions, {
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

    // Find existing Article
    $scope.findOne = function () {
      $scope.question = Questions.get({
        questionId: $stateParams.questionId
      },
        function (successResponse) {

          if (successResponse.usersWhoUpvoted.length > 0){
            $scope.upvotedOrNot = successResponse.usersWhoUpvoted.indexOf($scope.currentUser._str) === -1;
          }
          else{
            $scope.upvotedOrNot = false;
          }

          if (successResponse.usersWhoDownvoted.length > 0){
            $scope.downvotedOrNot = successResponse.usersWhoDownvoted.indexOf($scope.currentUser._str) === -1;
          }
          else {
            $scope.downvotedOrNot = false;
          }
          $scope.buildPagerForOneQuestion();
        },
        function (errorResponse) {
          // failure callback
          console.log(errorResponse);
        }
      );

    };

    $scope.buildPagerForOneQuestion = function () {
      $scope.pagedItemsForOneQuestion = [];
      $scope.itemsPerPageForOneQuestion = 4;
      $scope.currentPageForOneQuestion = 1;
      $scope.figureOutItemsToDisplayForOneQuestion();
    };

    $scope.figureOutItemsToDisplayForOneQuestion = function () {
      $scope.filteredItemsForOneQuestion = $filter('filter')($scope.question.comments, {
        $: $scope.search
      });

      $scope.filterLengthForOneQuestion = $scope.filteredItemsForOneQuestion.length;
      var begin = (($scope.currentPageForOneQuestion - 1) * $scope.itemsPerPageForOneQuestion);
      var end = begin + $scope.itemsPerPageForOneQuestion;
      $scope.pagedItemsForOneQuestion = $scope.filteredItemsForOneQuestion.slice(begin, end);
    };

    $scope.pageChangedForOneQuestion = function () {
      $scope.figureOutItemsToDisplayForOneQuestion();
    };

    $scope.alreadyVoted = function () {
      ngDialog.open({ template: 'firstDialogId' });
    };

    $scope.ownerQuestion = function () {
      ngDialog.open({ template: 'ownerQuestion' });
    };
    
    $scope.votedComment = function () {
      ngDialog.open({ template: 'votedComment' });
    };

    $scope.ownerComment = function () {
      ngDialog.open({ template: 'ownerComment' });
    };
    
  }
]);
