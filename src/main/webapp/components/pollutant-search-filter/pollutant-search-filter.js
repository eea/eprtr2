'use strict';

angular.module('myApp.pollutantSearchFilter', ['restangular', 'myApp.search-filter'])

.controller('pollutantSearchFilterController', ['$scope', 'pollutantSearchFilter', 'searchFilter', 'pollutantService', function($scope, pollutantSearchFilter, searchFilter, pollutantService) {
        $scope.pollutantSearchFilter = pollutantSearchFilter;
        searchFilter.pollutantSearchFilter = pollutantSearchFilter;

        var allPollutantGroups = { name : 'All pollutant groups' };
        $scope.pollutantSearchFilter.selectedPollutantGroup = allPollutantGroups;
        $scope.pollutantGroups = [allPollutantGroups];
        pollutantService.getList().then(function (data) {
            $scope.pollutantGroups = $scope.pollutantGroups.concat(data);
        });

        $scope.$watch('pollutantSearchFilter.selectedPollutantGroup', function() {
            var allPollutants = { name : 'All pollutants' };
            $scope.pollutantSearchFilter.selectedPollutant = allPollutants;
            $scope.pollutants = [allPollutants];
            if (pollutantSearchFilter.selectedPollutantGroup.lov_PollutantID) {
                pollutantService.getList({ParentID: pollutantSearchFilter.selectedPollutantGroup.lov_PollutantID}).then(function (data) {
                    $scope.pollutants = $scope.pollutants.concat(data);
                });
            }
        });
    }])

.factory('pollutantSearchFilter', [function() {
        return {
            accidentalOnly : false,
            releasesToAir : true,
            releasesToWater : true,
            releasesToSoil : true,
            transfersToWasteWater : true,

            filter : function(queryParams) {
                if (this.accidentalOnly) {
                    queryParams.Accidental = 1;
                }
                var mediumCodes = [];
                if (!this.releasesToAir) {
                    mediumCodes = mediumCodes.concat('AIR');
                }
                if (!this.releasesToWater) {
                    mediumCodes = mediumCodes.concat('WATER');
                }
                if (!this.releasesToSoil) {
                    mediumCodes = mediumCodes.concat('LAND');
                }
                if (!this.transfersToWasteWater) {
                    mediumCodes = mediumCodes.concat('WASTEWATER');
                }
                if (mediumCodes.length > 0) {
                    queryParams.MediumCode = mediumCodes;
                }
                if (this.selectedPollutant.lov_PollutantID) {
                    queryParams.LOV_PollutantID = this.selectedPollutant.lov_PollutantID;
                } else if (this.selectedPollutantGroup.lov_PollutantID) {
                    queryParams.LOV_PollutantGroupID = this.selectedPollutantGroup.lov_PollutantID;
                }
            }
        };
    }])

.service('pollutantService', ['Restangular', function(Restangular){
        var Pollutant = Restangular.service('pollutant');
        return Pollutant;
    }])

.directive('pollutantSearchFilterDirective', function() {
        return {
            controller: 'pollutantSearchFilterController',
            templateUrl: 'components/pollutant-search-filter/pollutant-search-filter.html'
        };
    });
