'use strict';

describe('Check that Main module has been registered', function() {
  var mainModule;
  beforeEach(function() {
    mainModule = angular.module('mean');
  });
  it('Should already be registered', function() {
    expect(mainModule).toBeDefined();
  });
});
