'use strict';

angular.module('myApp.facilitylevels', ['ngRoute', 'myApp.search-filter', 'restangular', 'myApp.activitySearchFilter', 'myApp.pollutantSearchFilter', 'myApp.wasteSearchFilter','angularSpinner','ngCsv'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitylevels', {
    templateUrl: 'views/facilitylevels/facilitylevels.html',
    controller: 'FacilityLevelsCtrl'
  });
}])

.controller('FacilityLevelsCtrl', ['$scope', '$filter', '$http', 'searchFilter', 'Restangular','translationService','usSpinnerService', 
                                   function($scope, $filter, $http, searchFilter, Restangular,translationService,usSpinnerService) {

        $scope.showReceivingCountryInputField = true;
        $scope.showReleasesToInputField = true;
        $scope.showTransfersToInputField = true;
        $scope.showAccidentalOnlyInputField = true;
        $scope.pollutantPanelTitle = 'Pollutant releases and transfers';
        $scope.usePollutantSelectorHeaders = true;
        $scope.resize_icon = "fa fa-arrow-left"
        $scope.bigmap = false;
        $scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    	$scope.mapctrl = {};
    	$scope.mapheight = window.innerHeight > 820 ? 600 : window.innerHeight -230;

    $scope.beforesearch = true;
	$scope.searchFilter = searchFilter;
	$scope.queryParams = {};
	$scope.queryParams.ReportingYear = -1;

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
		$scope.tr_chart = data.ChartLabels;
		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
	  });

	/**
	 * Tabs
	 */
    	$scope.active = {
    		facilities: true
    	};
        $scope.activateTab = function(tab) {
        	  $scope.active = {}; //reset
        	  $scope.active[tab] = true;
        	}
        
    	/**
    	 * Spinner
    	 */
        $scope.startSpin = function() {
            if (!$scope.spinneractive) {
              usSpinnerService.spin('spinner-1');
              $scope.spinneractive = true;
            }
          };

          $scope.stopSpin = function() {
            if ($scope.spinneractive) {
              usSpinnerService.stop('spinner-1');
              $scope.spinneractive = false;
            }
          };
          $scope.spinneractive = false;

          
          /**
           * MAp handling*/
          $scope.togglemapview = function(){
          	if($scope.bigmap){
              	$scope.bigmap = false;
              	$scope.resize_icon = "fa fa-arrow-left"
              	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
              	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
        		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
          	}
          	else{
              	$scope.bigmap = true;
              	$scope.resize_icon = "fa fa-arrow-right"
              	$scope.mapclss = "col-md-12 minor-padding";
              	$scope.resclss = "col-md-12 minor-padding";
        		$scope.maptooltip = $scope.tr_c['ShowReducedMap'];

          	}
          	$scope.mapctrl.redraw();
          }
/**
 * Sorting
 */
    $scope.sort = {
                sortingOrder : 'facilityName',
                reverse : false
            };
    
    $scope.gap = 5;
    
	$scope.searchResults = false;
    $scope.items = [];
    $scope.itemsPerPage = 15;
    $scope.pagedItems = [];
    $scope.currentPage = 1;
    $scope.totalItemCount = 0;

    $scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });
    
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
	
    
    /**
     * Search
     */
	$scope.search = function() {
		$scope.beforesearch = false;
		$scope.currentSearchFilter = $scope.searchFilter;
	    $scope.searchResults = true;
        $scope.currentPage = 1;
        $scope.sort.sortingOrder = 'facilityName';
        $scope.sort.reverse = false;
        $scope.startSpin();
        $scope.performSearch();
    };
	
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
        if ($scope.currentSearchFilter.activitySearchFilter) {
            $scope.currentSearchFilter.activitySearchFilter.filter(queryParams);
        }
        if ($scope.currentSearchFilter.pollutantSearchFilter) {
            $scope.currentSearchFilter.pollutantSearchFilter.filter(queryParams);
        }
        if ($scope.currentSearchFilter.wasteSearchFilter) {
            $scope.currentSearchFilter.wasteSearchFilter.filter(queryParams);
        }
	    queryParams.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
	    queryParams.limit = $scope.itemsPerPage;
	    queryParams.order = $scope.sort.sortingOrder;
	    queryParams.desc = $scope.sort.reverse;
	    $scope.queryParams = queryParams;
	    
	    facilitySearch.getList(queryParams).then(function(response) {
            $scope.items = response.data;
	        $scope.totalItemCount = response.headers('X-Count');
	        $scope.confidentialFacilities = response.headers('X-Confidentiality');
	        $scope.stopSpin();
	    });
	};

	$scope.hasItems = function() {
		return $scope.items.length > 0;
	};

	$scope.formatText = function(txt, confidential) {
		if (txt)
		{
			return txt;
		}
		else if (confidential)
		{
			return "CONFIDENTIAL";
		}
		else
		{
			return "-";
		}
	};
	
	$scope.downloadClick = function(){
		$scope.startSpin();
		
		var date = new Date();
    	var dateString = '_'+ date.getFullYear() +'_'+date.getMonth()+'_'+date.getDate();
		
		var rest = Restangular.withConfig(function(RestangularConfigurer) {
		    RestangularConfigurer.setFullResponse(true);
		});
		
		var facilitySearch = rest.all('facilitySearch');
		var qp = jQuery.extend(true, {}, $scope.queryParams);
		qp.limit = 0;
	    
	    facilitySearch.getList(qp).then(function(response) {
	        $scope.updateFacilitiesDownload(response.data);
	        
	        var csvContent = "data:text/csv;charset=utf-8,";
		    $scope.facilitiesDownload.forEach(function(infoArray, index){

		       var dataString = infoArray.join(';').split();
		       csvContent += dataString + "\n";

		    }); 
		    
		    var encodedUri = encodeURI(csvContent);
		    var link = document.createElement("a");
		    link.setAttribute("href", encodedUri);
		    link.setAttribute("download", "EPRTR_Facility_Level_Facilities"+dateString+".csv");

		    link.click(); // This will download the data file named "my_data.csv".
		    
	        $scope.stopSpin();
	    });
	}
	
	$scope.updateFacilitiesDownload = function(items){
		$scope.facilitiesDownload= new Array();
		
		$scope.facilitiesDownload[1]= new Array();
		$scope.facilitiesDownload[1][0] = $scope.tr_c.Year;
		$scope.facilitiesDownload[1][1] = $scope.queryParams.ReportingYear;
    	
		$scope.facilitiesDownload[2]= new Array();
    	$scope.facilitiesDownload[2][0] = $scope.tr_c.Area;
    	$scope.facilitiesDownload[2][1] = $scope.currentSearchFilter.selectedReportingCountry.name;
    	
    	$scope.facilitiesDownload[3]= new Array();
    	$scope.facilitiesDownload[3][0] = ' ';
		
        var top_fields = 4;
        
        $scope.facilitiesDownload[top_fields]= new Array();
        $scope.facilitiesDownload[top_fields][0] = $scope.tr_f.FacilityName;
    	$scope.facilitiesDownload[top_fields][1] = $scope.tr_f.PostalCode;
    	$scope.facilitiesDownload[top_fields][2] = $scope.tr_f.Address;
    	$scope.facilitiesDownload[top_fields][3] = $scope.tr_f.TownVillage;
    	$scope.facilitiesDownload[top_fields][4] = $scope.tr_f.Activity;
    	$scope.facilitiesDownload[top_fields][5] = $scope.tr_f.Country;

    	top_fields += 1;
    	
        for(var i =0; i<items.length;i++){
        	var facility = items[i];
        	$scope.facilitiesDownload[i+top_fields]= new Array();
        	$scope.facilitiesDownload[i+top_fields][0] = $scope.formatText(facility.facilityName, facility.confidentialIndicator);
        	$scope.facilitiesDownload[i+top_fields][1] = $scope.formatText(facility.postalCode, facility.confidentialIndicator);
        	$scope.facilitiesDownload[i+top_fields][2] = $scope.formatText(facility.address, facility.confidentialIndicator)
        	$scope.facilitiesDownload[i+top_fields][3] = $scope.formatText(facility.city, facility.confidentialIndicator);
        	$scope.facilitiesDownload[i+top_fields][4] = facility.iaactivityCode;
        	$scope.facilitiesDownload[i+top_fields][5] = facility.countryCode;
        }
	}
}])

.directive("customSort", function() {
	return {
	    restrict: 'A',
	    transclude: true,    
	    scope: {
	      order: '=',
	      sort: '='
	    },
	    template : 
	      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
	      '    <span ng-transclude></span>'+
	      '    <i ng-class="selectedCls(order)"></i>'+
	      '</a>',
	    link: function(scope) {
	                
	    // change sorting order
	    scope.sort_by = function(newSortingOrder) {       
	        var sort = scope.sort;
	        
	        if (sort.sortingOrder == newSortingOrder){
	            sort.reverse = !sort.reverse;
	        } else {
	        	sort.reverse = false;
	        }                    
	
	        sort.sortingOrder = newSortingOrder;
	    };
	    
	   
	    scope.selectedCls = function(column) {
	        if(column == scope.sort.sortingOrder){
	            return ('fa fa-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
	        }
	        else{            
	            return'fa fa-sort';
	        }
	    };      
	  }// end link
	};
})

;