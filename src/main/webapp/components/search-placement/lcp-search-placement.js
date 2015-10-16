'use strict';

angular.module('myApp.lcp-search-placement', ['myApp.home', 'myApp.search-filter'])

.controller('LcpSearchPlacementController', ['$scope', '$http', 'searchFilter','eprtrcms', 'lcpconf', function($scope, $http, searchFilter,eprtrcms,lcpconf) {
    
	$scope.searchFilter = searchFilter;
	$scope.searchFilter.regionType = '1';

	eprtrcms.get('Common',null).then(function (data) {
		$scope.tr_c = data;
	});
	/*$http.get('/reportingYears').success(function(data, status, headers, config) {
        $scope.reportingYears = data;
        $scope.searchFilter.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
    });*/

	var _refyer_q = lcpconf.lcpLayerUrl + '1/query?where=1%3D1&outFields='
		+ lcpconf.layerfields[1].referenceyear + '&orderByFields=' 
		+ lcpconf.layerfields[1].referenceyear + '&returnDistinctValues=true&f=pjson';
    
	$http.get(_refyer_q).success(function(data, status, headers, config) {
		var _years = [];
		angular.forEach(data.features, function(item) {
			_years.push({"year":item.attributes[lcpconf.layerfields[1].referenceyear]});
		});
	    $scope.reportingYears = _years;
	    $scope.searchFilter.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
	});

    $http.get('/areagroupReportingCountries').success(function(data, status, headers, config) {
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
        /*if ($scope.searchFilter.regionType === '0') {*/
            $scope.regions = [{'lov_CountryID': null, 'name': 'All regions'}];
        /*} else if ($scope.searchFilter.regionType === '1') {
            $scope.regions = [{'lov_CountryID': null, 'name': 'All river basin districts'}];
        }*/
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            /*if ($scope.searchFilter.regionType === '0') {*/
                $http.get('/regions?LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            /*} else if ($scope.searchFilter.regionType === '1') {
                $http.get('/riverBasinDistricts?LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
            }*/
        }
        $scope.searchFilter.selectedRegion = $scope.regions[0];
    };
}])

.directive('lcpSearchPlacement', function() {
	return {
		controller: 'LcpSearchPlacementController',
		templateUrl: 'components/search-placement/lcp-search-placement.html'
	};
});
