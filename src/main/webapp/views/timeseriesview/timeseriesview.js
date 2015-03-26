'use strict';

angular.module('myApp.timeseriesview', ['ngRoute','myApp.timeseries', 'myApp.search-filter', 'restangular', 'myApp.activitySearchFilter', 'myApp.pollutantSearchFilter', 'myApp.wasteSearchFilter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/timeseriesview', {
    templateUrl: 'views/timeseriesview/timeseriesview.html',
    controller: 'TimeseriesViewController'
  });
}])

.controller('TimeseriesViewController', ['$scope','$routeParams', '$filter', '$http', 'searchFilter', 'Restangular',  function($scope, $routeParams, $filter, $http, searchFilter, Restangular) {
	$scope.qparams = {};
	$scope.year=2010;

    $scope.showReceivingCountryInputField = true;
    $scope.showReleasesToInputField = true;
    $scope.showTransfersToInputField = true;
    $scope.showAccidentalOnlyInputField = true;
    $scope.pollutantPanelTitle = 'Pollutant releases and transfers';
    $scope.usePollutantSelectorHeaders = true;


	$scope.searchFilter = searchFilter;
	$scope.queryParams = {};
	$scope.queryParams.ReportingYear = -1;

	$scope.searchFilter.contenttype = 'pollutanttransfer';
	
	$scope.prtrtype1 = '';
	
	
   /* $scope.sort = {
            sortingOrder : 'facilityName',
            reverse : false
        };*/

$scope.gap = 5;

$scope.searchResults = false;
$scope.items = [];
$scope.itemsPerPage = 30;
$scope.pagedItems = [];
$scope.currentPage = 1;
$scope.totalItemCount = 0;

$scope.$watch('currentPage', function(value) {
	if ($scope.currentSearchFilter !== undefined) {
		$scope.performSearch();
	}
});

/*$scope.$watch('sort.sortingOrder', function(value) {
	var prevPage = $scope.currentPage;
	$scope.currentPage = 1;
	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
		$scope.performSearch();
	}
});*/

$scope.$watch('searchFilter.contenttype', function(value) {
	// We might change search options
	console.log('prtr type:' + value);
	$scope.contenttype1 = value;
});

/*
$scope.$watch('sort.reverse', function(value) {
	var prevPage = $scope.currentPage;
	$scope.currentPage = 1;
	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
		$scope.performSearch();
	}
});*/

$scope.search = function() {
	$scope.currentSearchFilter = $scope.searchFilter;
    $scope.searchResults = true;
    $scope.currentPage = 1;
    //$scope.sort.sortingOrder = 'facilityName';
    //$scope.sort.reverse = false;
    $scope.performSearch();
};

$scope.performSearch = function() {
	/*var rest = Restangular.withConfig(function(RestangularConfigurer) {
	    RestangularConfigurer.setFullResponse(true);
	});
	
    var facilitySearch = rest.all('facilitySearch');
    */
    var queryParams = {ReportingYear: $scope.currentSearchFilter.selectedReportingYear.year};
    if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.countryId) {
    	queryParams.LOV_CountryID = $scope.currentSearchFilter.selectedReportingCountry.countryId;
	    if ($scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID) {
	    	queryParams.LOV_NUTSRegionID = $scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID;
	    }
	    else if ($scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID) {
	    	queryParams.LOV_RiverBasinDistrictID = $scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID;
	    }
    }
    if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
    	queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
    }
    if ($scope.currentSearchFilter.facilityName) {
    	queryParams.FacilityName = $scope.currentSearchFilter.facilityName;
    }
    if ($scope.currentSearchFilter.cityName) {
    	queryParams.CityName = $scope.currentSearchFilter.cityName;
    }
    if ($scope.currentSearchFilter.activitySearchFilter) {
        $scope.currentSearchFilter.activitySearchFilter.filter(queryParams);
    }
    if ($scope.currentSearchFilter.pollutantSearchFilter) {
        $scope.currentSearchFilter.pollutantSearchFilter.filter(queryParams);
    }
    if ($scope.currentSearchFilter.wasteSearchFilter) {
        $scope.currentSearchFilter.wasteSearchFilter.filter(queryParams);
    }
   // queryParams.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
   // queryParams.limit = $scope.itemsPerPage;
   // queryParams.order = $scope.sort.sortingOrder;
   // queryParams.desc = $scope.sort.reverse;
    $scope.queryParams = queryParams;
    
    $scope.qparams = queryParams;
/*    facilitySearch.getList(queryParams).then(function(response) {
        $scope.items = response.data;
        $scope.totalItemCount = response.headers('X-Count');
        $scope.confidentialFacilities = response.headers('X-Confidentiality');
    });
    */
    
    
};

/*$scope.hasItems = function() {
	return $scope.items.length > 0;
};*/

	
	/**/
	
/*    $scope.fdrID = $routeParams.FacilityReportID !== undefined ? $routeParams.FacilityReportID: null;// 10;
    if($scope.fdrID === null){
	    $scope.fdID = $routeParams.FacilityID !== undefined ? $routeParams.FacilityID: 9893;//null;
	    $scope.year = $routeParams.ReportingYear !== undefined ? $routeParams.ReportingYear: 2010;//null;
    }*/

}]);