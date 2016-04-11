'use strict';

(function () {
  // Articles Controller Spec
  describe('Messages Controller Tests', function () {
    // Initialize global variables
    var MessagesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Messages,
      mockMessage;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Messages_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Messages = _Messages_;

      // create mock article
      mockMessage = new Messages.lookup({
        _id: '525a8422f6d0f87f0e407a33',
        sender: '525a8422f6d0f87f0e407a55',
        content: 'Hello world!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['student']
      };

      // Initialize the Messages controller.
      MessagesController = $controller('MessagesController', {
        $scope: scope
      });
    }));

    it('$scope.findOne() should create an array with one message object fetched from XHR using a articleId URLparameter', inject(function (Messages) {
      // Set the URL parameter
      $stateParams.messageId = mockMessage._id;

      // Set GET response
      $httpBackend.expectGET('/api/messages').respond(mockMessage);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.showMessages).toEqualData(mockMessage);
    }));
  });
}());
