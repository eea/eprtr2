'use strict';

angular.module('myApp.activitySearchFilter', ['restangular', 'myApp.search-filter'])

.controller('activitySearchFilterController', ['$scope', 'activitySearchFilter', 'searchFilter', 'NaceActivity', function($scope, activitySearchFilter, searchFilter, NaceActivity) {
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
            if ($scope.activitySearchFilter.activityType === '1') {
                var params = {};
                NaceActivity.getList(params).then(function (data) {
                    $scope.sectors = $scope.sectors.concat(data);
                });
            }
        };

        $scope.updateActivity = function() {
            $scope.activitySearchFilter.selectedActivities = [allActivities];
            $scope.activities = [allActivities];
            var selectedSectors = $scope.activitySearchFilter.selectedSectors;
            if (selectedSectors.length === 1 && selectedSectors[0] !== allSectors) {
                if ($scope.activitySearchFilter.activityType === '1') {
                    var params = {ParentID: selectedSectors[0].lov_NACEActivityID};
                    NaceActivity.getList(params).then(function (data) {
                        $scope.activities = $scope.activities.concat(data);
                    });
                }
            }
        };

        $scope.updateSubActivity = function() {
            $scope.activitySearchFilter.selectedSubActivities = [allSubActivities];
            $scope.subActivities = [allSubActivities];
            var selectedActivities = $scope.activitySearchFilter.selectedActivities;
            if (selectedActivities.length === 1 && selectedActivities[0] !== allActivities) {
                if ($scope.activitySearchFilter.activityType === '1') {
                    var params = {ParentID: selectedActivities[0].lov_NACEActivityID};
                    NaceActivity.getList(params).then(function (data) {
                        $scope.subActivities = $scope.subActivities.concat(data);
                    });
                }
            }
        };
    }])

.factory('activitySearchFilter', [function() {
        var searchFilter = {};
        searchFilter.activityType = '0';
        return searchFilter;
    }])

.service('NaceActivity', ['Restangular', function(Restangular){
        var NaceActivity = Restangular.service('naceActivity');

        Restangular.extendModel('naceActivity', function(model) {
            model.getDisplayText = function() {
                return this.code + ' ' + this.name;
            };
            return model;
        });

        return NaceActivity;
    }])

.directive('activitySearchFilterDirective', function() {
        return {
            controller: 'activitySearchFilterController',
            templateUrl: 'components/activity-search-filter/activity-search-filter.html'
        };
    });
