'use strict';

angular.module('myApp.activitySearchFilter', ['restangular', 'myApp.search-filter'])

.controller('activitySearchFilterController', ['$scope', 'activitySearchFilter', 'searchFilter', 'naceActivityType', 'annexIActivityType', function($scope, activitySearchFilter, searchFilter, naceActivityType, annexIActivityType) {
        $scope.activitySearchFilter = activitySearchFilter;
        searchFilter.activitySearchFilter = activitySearchFilter;

        activitySearchFilter.activityType = annexIActivityType;
        activitySearchFilter.annexIActivityType = annexIActivityType;
        activitySearchFilter.naceActivityType = naceActivityType;

        $scope.$watch('activitySearchFilter.activityType', function() {
            var all = { getDisplayText : function() { return 'All sectors'; } };
        	$scope.activitySearchFilter.selectedSectors = [all];
            $scope.sectors = [all];
            activitySearchFilter.activityType.getList().then(function (data) {
                $scope.sectors = $scope.sectors.concat(data);
            });
        });
        $scope.$watch('activitySearchFilter.selectedSectors', function(value) {
            var all = { getDisplayText : function() { return 'All activities'; } };
        	$scope.activitySearchFilter.selectedActivities = [all];
            $scope.activities = [all];
            if (value.length === 1 && value[0].code) {
                activitySearchFilter.activityType.getList(value[0]).then(function (data) {
                    $scope.activities = $scope.activities.concat(data);
                });
            }
        });
        $scope.$watch('activitySearchFilter.selectedActivities', function(value) {
            var all = { getDisplayText : function() { return 'All sub-activities'; } };
        	$scope.activitySearchFilter.selectedSubActivities = [all];
            $scope.subActivities = [all];
            if (value.length === 1 && value[0].code) {
                activitySearchFilter.activityType.getList(value[0]).then(function (data) {
                    $scope.subActivities = $scope.subActivities.concat(data);
                });
            }
        });
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
        return {};
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
