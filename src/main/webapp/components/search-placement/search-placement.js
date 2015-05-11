'use strict';

angular.module('myApp.search-placement', ['myApp.home', 'myApp.search-filter'])

.controller('SearchPlacementController', ['$scope', '$http', 'searchFilter','translationService', function($scope, $http, searchFilter,translationService) {
    
	$scope.searchFilter = searchFilter;
	$scope.searchFilter.regionType = '1';

	translationService.get().then(function (data) {
		$scope.tr_c = data.Common;
	});

	$http.get('/reportingYears').success(function(data, status, headers, config) {
        $scope.reportingYears = data;
        $scope.searchFilter.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
    });

    $http.get('/reportingCountries').success(function(data, status, headers, config) {
        $scope.reportingCountries = data;
        $scope.searchFilter.selectedReportingCountry = $scope.reportingCountries[0];
    });

    $scope.$watch('searchFilter.selectedReportingCountry', function(value) {
        $scope.disableRegionSelect = true;
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            $scope.disableRegionSelect = false;
        }
        $scope.updateRegions();
    });

    
    $scope.$watch('searchFilter.regionType', function(value) {
        $scope.updateRegions();
    });

    $scope.updateRegions = function() {
        $scope.regions = null;
        if ($scope.searchFilter.regionType === '0') {
            $scope.regions = [{'lov_CountryID': null, 'name': 'All regions'}];
        } else if ($scope.searchFilter.regionType === '1') {
            $scope.regions = [{'lov_CountryID': null, 'name': 'All river basin districts'}];
        }
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            if ($scope.searchFilter.regionType === '0') {
                $http.get('/regions?LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            } else if ($scope.searchFilter.regionType === '1') {
                $http.get('/riverBasinDistricts?LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            }
        }
        $scope.searchFilter.selectedRegion = $scope.regions[0];
    };
}])

.directive('searchPlacement', function() {
	return {
		controller: 'SearchPlacementController',
		templateUrl: 'components/search-placement/search-placement.html'
	};
});
