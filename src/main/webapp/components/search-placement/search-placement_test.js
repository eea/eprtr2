'use strict';

describe('myApp.search-placement module', function() {
    beforeEach(module('myApp.search-placement'));

    var $controller;
    var $rootScope;

    beforeEach(inject(function(_$controller_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    describe('$scope', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('SearchPlacementController', { $scope: $scope });
        });

        it('...', function() {
            expect($scope.regionType).toEqual('1');
        });

    });

});
