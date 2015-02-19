'use strict';

angular.module('myApp.activitySearchFilter', ['restangular', 'myApp.search-filter'])

.controller('activitySearchFilterController', ['$scope', 'activitySearchFilter', 'searchFilter', 'naceActivityType', 'annexIActivityType', function($scope, activitySearchFilter, searchFilter, naceActivityType, annexIActivityType) {
        $scope.activitySearchFilter = activitySearchFilter;
        searchFilter.activitySearchFilter = activitySearchFilter;

        $scope.$watch('activitySearchFilter.activityType', function(value) {
            $scope.updateSector();
        });
        $scope.$watch('activitySearchFilter.selectedSectors', function(value) {
            $scope.updateActivity();
        });
        $scope.$watch('activitySearchFilter.selectedActivities', function(value) {
            $scope.updateSubActivity();
        });

        activitySearchFilter.activityType = annexIActivityType;
        activitySearchFilter.annexIActivityType = annexIActivityType;
        activitySearchFilter.naceActivityType = naceActivityType;

        var allSectors = {};
        allSectors.getDisplayText = function() {
            return 'All sectors';
        };
        var allActivities = {};
        allActivities.getDisplayText = function() {
            return 'All activities';
        };
        var allSubActivities = {};
        allSubActivities.getDisplayText = function() {
            return 'All sub-activities';
        };

        $scope.updateSector = function() {
            $scope.activitySearchFilter.selectedSectors = [allSectors];
            $scope.sectors = [allSectors];
            activitySearchFilter.activityType.getList().then(function (data) {
                $scope.sectors = $scope.sectors.concat(data);
            });
        };

        $scope.updateActivity = function() {
            $scope.activitySearchFilter.selectedActivities = [allActivities];
            $scope.activities = [allActivities];
            var selectedSectors = $scope.activitySearchFilter.selectedSectors;
            if (selectedSectors.length === 1 && selectedSectors[0] !== allSectors) {
                activitySearchFilter.activityType.getList(selectedSectors[0]).then(function (data) {
                    $scope.activities = $scope.activities.concat(data);
                });
            }
        };

        $scope.updateSubActivity = function() {
            $scope.activitySearchFilter.selectedSubActivities = [allSubActivities];
            $scope.subActivities = [allSubActivities];
            var selectedActivities = $scope.activitySearchFilter.selectedActivities;
            if (selectedActivities.length === 1 && selectedActivities[0] !== allActivities) {
                activitySearchFilter.activityType.getList(selectedActivities[0]).then(function (data) {
                    $scope.subActivities = $scope.subActivities.concat(data);
                });
            }
        };
    }])

.factory('naceActivityType', ['naceActivityService', function(naceActivityService) {
        return {
            getList : function(parent) {
                var params = {};
                if (parent !== undefined) {
                    params = {ParentID: parent.lov_NACEActivityID};
                }
                return naceActivityService.getList(params);
            }
        };
    }])

.factory('annexIActivityType', ['annexIActivityService', function(annexIActivityService) {
        return {
            getList : function(parent) {
                var params = {};
                if (parent !== undefined) {
                    params = {ParentID: parent.lov_AnnexIActivityID};
                }
                return annexIActivityService.getList(params);
            }
        };
    }])

.factory('activitySearchFilter', [function() {
        var searchFilter = {};
        return searchFilter;
    }])

.service('naceActivityService', ['Restangular', function(Restangular){
        var NaceActivity = Restangular.service('naceActivity');

        Restangular.extendModel('naceActivity', function(model) {
            model.getDisplayText = function() {
                return this.code + ' ' + this.name;
            };
            return model;
        });

        return NaceActivity;
    }])

.service('annexIActivityService', ['Restangular', function(Restangular){
        var AnnexIActivity = Restangular.service('annexIActivity');

        Restangular.extendModel('annexIActivity', function(model) {
            model.getDisplayText = function() {
                return this.code + ' ' + this.name;
            };
            return model;
        });

        return AnnexIActivity;
    }])

.directive('activitySearchFilterDirective', function() {
        return {
            controller: 'activitySearchFilterController',
            templateUrl: 'components/activity-search-filter/activity-search-filter.html'
        };
    });
