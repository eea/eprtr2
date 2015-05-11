'use strict';

angular.module('myApp.areaoverview', ['ngRoute', 'myApp.search-filter', 'restangular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/areaoverview', {
    templateUrl: 'views/areaoverview/areaoverview.html',
    controller: 'AreaOverviewCtrl'
  });
}])



.controller('AreaOverviewCtrl', ['$scope', '$filter', '$http', 'searchFilter', 'Restangular', 'translationService', function($scope, $filter, $http, searchFilter, Restangular, translationService) {
	
	 $http.get('/pollutant').success(function(data, status, headers, config) {
	        $scope.polutantMainGroup = data;
	        $scope.searchFilter.selectedPolutantGroup = $scope.polutantMainGroup[0];
	    });
	
	
	$scope.searchFilter = searchFilter;
	
	translationService.get().then(function (data) {
		$scope.tr_lco = data.LOV_COUNTRY;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_f = data.Facility;
		$scope.tr_c = data.Common;
		$scope.tr_p = data.Pollutant;
		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
		$scope.tr_con =data.Confidentiality;
		$scope.tr_lpo = data.LOV_POLLUTANT;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_wt = data.WasteTransfers;
		$scope.tr_ao = data.AreaOverview;
		$scope.tr_lovwt = data.LOV_WASTETYPE;
	  });
	
	$scope.expandButtonImage = 'images/expand_blue.jpg';
	$scope.expandButtonText = 'Expand to include';
	$scope.collapseButtonImage = 'images/collapse_blue.jpg';
	$scope.collapseButtonText = 'Collapse to exclude';

	$scope.activityPanel = false;
	$scope.activityPanelToggleButtonImage = $scope.expandButtonImage;
	$scope.activityPanelToggleButtonTitle = $scope.expandButtonText;
	$scope.toggleActivityPanel = function() {
	    $scope.activityPanel = !$scope.activityPanel;
	    if ($scope.activityPanel) {
	    	$scope.activityPanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.activityPanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.activityPanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.activityPanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }

	$scope.pollutantPanel = false;
	$scope.pollutantPanelToggleButtonImage = $scope.expandButtonImage;
	$scope.pollutantPanelToggleButtonTitle = $scope.expandButtonText;
	$scope.togglePollutantPanel = function() {
	    $scope.pollutantPanel = !$scope.pollutantPanel;
	    if ($scope.pollutantPanel) {
	    	$scope.pollutantPanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.pollutantPanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.pollutantPanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.pollutantPanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }

	$scope.wastePanel = false;
	$scope.wastePanelToggleButtonImage = $scope.expandButtonImage;
	$scope.wastePanelToggleButtonTitle = $scope.expandButtonText;
	$scope.toggleWastePanel = function() {
	    $scope.wastePanel = !$scope.wastePanel;
	    if ($scope.wastePanel) {
	    	$scope.wastePanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.wastePanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.wastePanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.wastePanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }
	
	$scope.searchFilter.activityType = "0";
	
	
	// init
    $scope.sort = {       
                sortingOrder : 'facilityName',
                reverse : false
            };
    
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
    $scope.$watch('sort.sortingOrder', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch();
    	}
    });
    
    $scope.$watch('sort.reverse', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch();
    	}
    });
	
	$scope.search = function() {
		$scope.currentSearchFilter = $scope.searchFilter;
	    $scope.searchResults = true;
        $scope.currentPage = 1;
        $scope.sort.sortingOrder = 'facilityName';
        $scope.sort.reverse = false;
        $scope.performSearch();
    }
	
	$scope.performSearch = function() {
		var rest = Restangular.withConfig(function(RestangularConfigurer) {
		    RestangularConfigurer.setFullResponse(true);
		});
		
	    var facilitySearch = rest.all('facilitySearch');
	    
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
	    queryParams.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
	    queryParams.limit = $scope.itemsPerPage;
	    queryParams.order = $scope.sort.sortingOrder;
	    queryParams.desc = $scope.sort.reverse;
	    
	    facilitySearch.getList(queryParams).then(function(response) {
	        $scope.items = response.data;
	        $scope.totalItemCount = response.headers('X-Count');
	    });
	}
    
    $scope.hasItems = function() {
    	return $scope.items.length > 0;
    }
}])



;