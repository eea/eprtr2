'use strict';

angular.module('myApp.industrialactivity', ['ngRoute','googlechart', 'myApp.search-filter', 'restangular','ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/industrialactivity', {
            templateUrl: 'views/industrialactivity/industrialactivity.html',
            controller: 'IndustrialActivityCtrl'
        });
    }])

    .controller('IndustrialActivityCtrl', ['$scope', '$filter', 'searchFilter', 'Restangular','translationService','formatStrFactory', function($scope, $filter, searchFilter, Restangular,translationService,formatStrFactory) {
        $scope.activityPanel = true;
        $scope.searchFilter = searchFilter;
        $scope.queryParams = {};
        $scope.queryParams.ReportingYear = -1;
        $scope.translate = function()
        {
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
        		$scope.tr_ina = data.IndustrialActivity;
        	  });
        };
        $scope.translate();
        
        
        $scope.search = function() {
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.performSearch();
        };
        
        $scope.performSearch = function() {
            
        	var restPollutantRelease = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
        	var restPollutantTransfer = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
        	var restWasteTransfer = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
            
        	var facilitySearchPollutantRelease = restWasteTransfer.all('pollutantreleaseSearch');
        	var facilitySearchPollutantTransfer = restWasteTransfer.all('pollutanttransferSearch');
            var facilitySearchWasteTransfer = restWasteTransfer.all('wastetransferSearch');
            
            $scope.regionSearch = false;
            
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
            if ($scope.currentSearchFilter.activitySearchFilter) {
                $scope.currentSearchFilter.activitySearchFilter.filter(queryParams);
            }
    
            
            if(searchFilter.regionType == 0)
            {
            	$scope.regionSearch = true;
            }else
            {
            	$scope.regionSearch = false;
            }
            $scope.queryParams = queryParams;
            
            // Create confidential search
            $scope.confidentialParams = angular.copy(queryParams);
            $scope.confidentialParams.ConfidentialIndicator = 1;
       
            facilitySearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;
                	
            });
            
            /*facilitySearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });*/
                      
        };
        
    }])
;