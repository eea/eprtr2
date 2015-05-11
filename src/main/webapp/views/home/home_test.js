'use strict';

describe('myApp.home module', function() {

  beforeEach(module('myApp.home'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));
  
  describe('home controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var $scope = {};
      //var controller = $controller('HomeCtrl', { $scope: $scope });
      var homeCtrl = $controller('HomeCtrl', { $scope: $scope });
      expect($scope.test('hej')).toEqual('hej');
    }));

  });
});