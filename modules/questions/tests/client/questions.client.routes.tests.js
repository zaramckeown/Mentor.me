'use strict';

describe('Testing Questions Routing', function () {
  var QuestionsController,
    scope,
    $httpBackend,
    $stateParams,
    $location,
    Authentication,
    Questions;

  // Load the main application module
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

    // Initialize the Questions controller.
    QuestionsController = $controller('QuestionsController', {
      $scope: scope
    });

    it('Should map a "list" route', function () {
      inject(function ($route) {
        expect($route.routes['/questions/create'].templateUrl).toEqual('modules/questions/client/views/create-question.client.view.html');
      });
    });
  }));
});
