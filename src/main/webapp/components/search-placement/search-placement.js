'use strict';

angular.module('myApp.search-placement', [])

.controller('SearchPlacementController', ['$scope', '$http', function($scope, $http) {
    
	$http.get('/eprtr/reportingYears').success(function(data, status, headers, config) {
        $scope.reportingYears = data;
        $scope.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
    });

    $http.get('/eprtr/reportingCountries').success(function(data, status, headers, config) {
        $scope.reportingCountries = data;
        $scope.selectedReportingCountry = $scope.reportingCountries[0];
    });

    $scope.$watch('selectedReportingCountry', function(value) {
        $scope.disableRegionSelect = true;
        if ($scope.selectedReportingCountry !== undefined && $scope.selectedReportingCountry.countryId) {
            $scope.disableRegionSelect = false;
        }
        $scope.updateRegions();
    });

    $scope.regionType = '1';
    $scope.$watch('regionType', function(value) {
        $scope.updateRegions();
    });

    $scope.updateRegions = function() {
        $scope.regions = null;
        if ($scope.regionType === '0') {
            $scope.regions = [{'lov_CountryID': null, 'name': 'All regions'}];
        } else if ($scope.regionType === '1') {
            $scope.regions = [{'lov_CountryID': null, 'name': 'All river basin districts'}];
        }
        if ($scope.selectedReportingCountry !== undefined && $scope.selectedReportingCountry.countryId) {
            if ($scope.regionType === '0') {
                $http.get('/eprtr/regions?LOV_CountryID=' + $scope.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            } else if ($scope.regionType === '1') {
                $http.get('/eprtr/riverBasinDistricts?LOV_CountryID=' + $scope.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            }
        }
        $scope.selectedRegion = $scope.regions[0];
    }
}])

.directive('searchPlacement', function() {
	return {
		controller: 'SearchPlacementController',
		templateUrl: 'components/search-placement/search-placement.html'
	};
});
