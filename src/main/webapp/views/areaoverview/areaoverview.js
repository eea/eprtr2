'use strict';

angular.module('myApp.areaoverview', ['ngRoute', 'myApp.search-filter', 
                                      'restangular','myApp.areaOverviewWasteTab', 'myApp.areaOverviewPtTab'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/areaoverview', {
    templateUrl: 'views/areaoverview/areaoverview.html',
    controller: 'AreaOverviewCtrl'
  });
}])



.controller('AreaOverviewCtrl', ['$scope', '$filter', '$http', 'searchFilter', 'Restangular', 'translationService', 
                                 'lovCountryType', 'lovAreaGroupType', 'lovNutsRegionType', 'riverBasinDistrictsType',
                                 function($scope, $filter, $http, searchFilter, Restangular, translationService,
                                		 lovCountryType, lovAreaGroupType, lovNutsRegionType, riverBasinDistrictsType) {
	
    $scope.searchFilter = searchFilter;
    $scope.queryParams = {};
    $scope.queryParams.ReportingYear = -1;
	$scope.headitms = [];

/*    $scope.regionSearch = false;
    //$scope.summaryItems = [];
    $scope.pollutantreleaseItems = [];
    $scope.pollutanttransferItems = [];
    $scope.itemsConfidentiality =[];
    $scope.itemCon = [];
    $scope.itemConReason = [];
    $scope.summaryItems = [];
    $scope.sectorIA ="";
    $scope.totalSearchResult = 0;
	*/
	
    $scope.translate = function()
    {
		translationService.get().then(function (data) {
			$scope.tr_ao = data.AreaOverview;
			$scope.tr_f = data.Facility;
			$scope.tr_c = data.Common;
			$scope.tr_lco = data.LOV_COUNTRY;
			$scope.tr_lnr = data.LOV_NUTSREGION;
			$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
			$scope.tr_lag = data.LOV_AREAGROUP;
    		$scope.tr_wt = data.WasteTransfers;
	    });
    };
    $scope.translate();
	
    $scope.active = {
    		fddetails: true
    	};
        $scope.activateTab = function(tab) {
        	$scope.active = {}; //reset
        	$scope.active[tab] = true;
    	};
    	$scope.setActiveTab = function(tab) {
    		$scope.active[tab] = true;
    	};

    	$scope.createheader = function(){
    		$scope.headitms = [];
    		/* HEADER PART FOR ReleaseYear*/
    		$scope.headitms.push({'order':0, 'clss':'fdTitles', 'title':$scope.tr_c.Year, 'val':$scope.queryParams.ReportingYear});

    		/* HEADER PART FOR AREA*/
    		var area = {'order':1,	'clss':'fdTitles', 'title':$scope.tr_c.Area};
    		if($scope.queryParams.LOV_AreaGroupID != undefined){
    			// Get list of Countries using AreaGroup ID
    			lovAreaGroupType.getByID($scope.queryParams.LOV_AreaGroupID).get().then(function(data) {
    				area.val = $scope.tr_lag[data.code];
    				$scope.headitms.push(area);
    			});
    		}
    		else if($scope.queryParams.LOV_CountryID != undefined){
    			//We use LOV_NUTSRegionID for title
    			//"lov_NUTSRLevel1ID":704,"lov_NUTSRLevel2ID":709,"lov_NUTSRLevel3ID":null
    			if($scope.queryParams.LOV_NUTSRegionID != undefined){
    				lovNutsRegionType.getByID($scope.queryParams.LOV_NUTSRegionID).get().then(function(data) {
    					area.val = $scope.tr_lnr[data.code];
    					$scope.headitms.push(area);
    				});
    			}
    			//We use LOV_RiverBasinDistrictID for title
    			else if($scope.queryParams.LOV_RiverBasinDistrictID != undefined){
    				riverBasinDistrictsType.getByID($scope.queryParams.LOV_RiverBasinDistrictID).get().then(function(data) {
    					area.val = $scope.tr_lrbd[data.code];
    					$scope.headitms.push(area);
    				});
    			}
    			//We use LOV_CountryID for title
    			else{
    				lovCountryType.getByID($scope.queryParams.LOV_CountryID).get().then(function(data) {
    					area.val = $scope.tr_lco[data.countryCode];
    					$scope.headitms.push(area);
    				});
    			}
    		}
    	}
  
	$scope.search = function() {
        $scope.performSearch();
    }
	
	$scope.performSearch = function() {
        var queryParams = {ReportingYear: $scope.searchFilter.selectedReportingYear.year};
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            queryParams.LOV_CountryID = $scope.searchFilter.selectedReportingCountry.countryId;
            if ($scope.searchFilter.selectedRegion.lov_NUTSRegionID) {
                queryParams.LOV_NUTSRegionID = $scope.searchFilter.selectedRegion.lov_NUTSRegionID;
            }
            else if ($scope.searchFilter.selectedRegion.lov_RiverBasinDistrictID) {
                queryParams.LOV_RiverBasinDistrictID = $scope.searchFilter.selectedRegion.lov_RiverBasinDistrictID;
            }
        }
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.groupId) {
            queryParams.LOV_AreaGroupID = $scope.searchFilter.selectedReportingCountry.groupId;
        }
        $scope.queryParams = queryParams;
        
        $scope.headitms = [];
        $scope.createheader();
	}
}])

;