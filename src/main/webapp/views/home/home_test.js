'use strict';

describe('myApp.home module', function() {

  var $scope = null;
  var ctrl = null;
    //var control
  beforeEach(module('myApp.home'));

  //var $controller;

  beforeEach(inject(function($rootScope, $controller){
    // The injector unwraps the underscores (_) from around the parameter names when matching
	  $scope = $rootScope.$new();
	  
	  ctrl = $controller('HomeCtrl', {
        $scope: $scope
      });
	  
	  
  }));
  
  describe('home controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      
      //var controller = $controller('HomeCtrl', { $scope: $scope });
      //var homeCtrl = $controller('HomeCtrl', { $scope: $scope });
      expect($scope.mapctrl).toEqual({});
    }));

  });
});