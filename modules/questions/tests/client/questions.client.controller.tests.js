/*
'use strict';

(function () {
  // Questions Controller Spec
  describe('Questions Controller Tests', function () {
    // Initialize global variables
    var QuestionsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Questions,
      mockQuestion;

    beforeAll(function() {
      angular.element(document.querySelector('head')).append('<base href="/">');
    });

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Questions_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Questions = _Questions_;

      // create mock question
      mockQuestion = new Questions({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!',
        user: '525a8422f6d0f87f0e407a32'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['student']
      };

      // Initialize the Questions controller.
      QuestionsController = $controller('QuestionsController', {
        $scope: scope
      });
    }));

    it('$scope.findOne() should create an array with one question object fetched from XHR using a questionId URL parameter', inject(function (Questions) {
      // Set the URL parameter
      $stateParams.questionId = mockQuestion._id;

      // Set GET response
      $httpBackend.expectGET('/api/questions/'+$stateParams.questionId).respond(mockQuestion);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.question).toEqualData(mockQuestion);
    }));

    describe('$scope.create()', function () {
      var sampleQuestionPostData;

      beforeEach(function () {
        // Create a sample question object
        sampleQuestionPostData = new Questions({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!',
          user: '525a8422f6d0f87f0e407a32'
        });

        // Fixture mock form input values
        scope.title = 'An Article about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Questions) {
        // Set POST response
        $httpBackend.expectPOST('api/questions', sampleQuestionPostData).respond(mockQuestion);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the question was created
        //expect($location.path.calls.mostRecent().args[0]).toBe('questions/' + mockQuestion._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/questions', sampleQuestionPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });
  });
}());
*/
