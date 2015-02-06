'use strict';

describe('myApp.about module', function() {

  beforeEach(module('myApp.about'));


  describe('about controller', function(){
    it('should ....', inject(function($controller) {
    	var $scope = {};
    	var aboutCtrl = $controller('AboutCtrl', { $scope: $scope });
    	expect(aboutCtrl).toBeDefined();
    }));

  });
});