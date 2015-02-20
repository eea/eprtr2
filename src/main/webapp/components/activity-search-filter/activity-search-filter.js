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
            },
            filter : function(filter, queryParams) {
                if (filter.selectedSubActivities.length === 1 && filter.selectedSubActivities[0].code) {
                    queryParams.LOV_NACESubActivityID = filter.selectedSubActivities[0].lov_NACEActivityID;
                } else if (filter.selectedActivities.length === 1 && filter.selectedActivities[0].code) {
                    queryParams.LOV_NACEActivityID = filter.selectedActivities[0].lov_NACEActivityID;
                } else if (filter.selectedSectors.length === 1 && filter.selectedSectors[0].code) {
                    queryParams.LOV_NACESectorID = filter.selectedSectors[0].lov_NACEActivityID;
                }
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
            },
            filter : function(filter, queryParams) {
                if (filter.selectedSubActivities.length === 1 && filter.selectedSubActivities[0].code) {
                    queryParams.LOV_AISubActivityID = filter.selectedSubActivities[0].lov_AnnexIActivityID;
                } else if (filter.selectedActivities.length === 1 && filter.selectedActivities[0].code) {
                    queryParams.LOV_AIActivityID = filter.selectedActivities[0].lov_AnnexIActivityID;
                } else if (filter.selectedSectors.length === 1 && filter.selectedSectors[0].code) {
                    queryParams.LOV_AISectorID = filter.selectedSectors[0].lov_AnnexIActivityID;
                }
            }
        };
    }])

.factory('activitySearchFilter', [function() {
        return {
            filter : function(queryParams) {
                this.activityType.filter(this, queryParams);
            }
        };
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
