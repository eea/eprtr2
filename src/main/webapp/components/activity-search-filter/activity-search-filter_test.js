'use strict';

describe('activitySearchFilter module', function() {
    beforeEach(module('myApp.activitySearchFilter'));

    var $controller;
    var $rootScope;
    var $httpBackend;

    beforeEach(inject(function(_$controller_, _$rootScope_, _$httpBackend_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    describe('$scope', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('activitySearchFilterController', { $scope: $scope });
        });

        it('should populate the sector list using the annexiactivity service', function() {
            $httpBackend.when('GET', '/annexIActivity').respond([{lov_AnnexIActivityID: 1, code: '01', name: 'AnnexI Sector'}]);
            $httpBackend.flush();
            $scope.$digest();
            expect($scope.sectors.length).toEqual(2);
            expect($scope.sectors[0].getDisplayText()).toEqual('All sectors');
            expect($scope.sectors[1].getDisplayText()).toEqual('01 AnnexI Sector');
        });

        it('should populate the sector list using the naceactivity service when activity type is changed to naceactivity', function() {
            $scope.activitySearchFilter.activityType = $scope.activitySearchFilter.naceActivityType;
            $httpBackend.when('GET', '/naceActivity').respond([{lov_AnnexIActivityID: 2, code: '02', name: 'NACE Sector'}]);
            $httpBackend.flush();
            $scope.$digest();
            expect($scope.sectors.length).toEqual(2);
            expect($scope.sectors[0].getDisplayText()).toEqual('All sectors');
            expect($scope.sectors[1].getDisplayText()).toEqual('02 NACE Sector');
        });

        it('should populate the activity list when a sector is selected', function() {
            $httpBackend.when('GET', '/annexIActivity').respond([{lov_AnnexIActivityID: 1, code: '01', name: 'AnnexI Sector'}]);
            $httpBackend.flush();
            $scope.$digest();
            expect($scope.sectors.length).toEqual(2);
            expect($scope.sectors[0].getDisplayText()).toEqual('All sectors');
            expect($scope.sectors[1].getDisplayText()).toEqual('01 AnnexI Sector');

            $scope.activitySearchFilter.selectedSectors = [$scope.sectors[1]];
            $httpBackend.when('GET', '/annexIActivity?ParentID=1').respond([{lov_AnnexIActivityID: 3, code: '03', name: 'AnnexI Activity'}]);
            $httpBackend.flush();
            $scope.$digest();
            expect($scope.activities.length).toEqual(2);
            expect($scope.activities[0].getDisplayText()).toEqual('All activities');
            expect($scope.activities[1].getDisplayText()).toEqual('03 AnnexI Activity');

        });

    });

});
