'use strict';

angular.module('myApp.areaoverview', ['ngRoute', 'myApp.search-filter', 
                                      'restangular','myApp.areaOverviewWasteTab', 'myApp.areaOverviewPtTab', 'myApp.areaOverviewPrTab'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/areaoverview', {
    templateUrl: 'views/areaoverview/areaoverview.html',
    controller: 'AreaOverviewCtrl'
  });
}])



.controller('AreaOverviewCtrl', ['$scope', '$filter', '$http', 'searchFilter', 'Restangular', 'translationService', 
                                 'lovCountryType', 'lovAreaGroupType', 'lovNutsRegionType', 'riverBasinDistrictsType', 'countFactory',
                                 function($scope, $filter, $http, searchFilter, Restangular, translationService,
                                		 lovCountryType, lovAreaGroupType, lovNutsRegionType, riverBasinDistrictsType, countFactory) {
	
	$scope.beforesearch = true;
    $scope.searchFilter = searchFilter;
    $scope.queryParams = {};
    $scope.queryParams.ReportingYear = -1;
	$scope.headitms = [];
	$scope.prMedium = {};
	//$scope.pritems = [];
	$scope.wasteTransferItems = [];
/*	$scope.prfilter = {};// .polsearch
    $scope.prfilter.pgselect = {};
	$scope.ptfilter = {};// .polsearch
    $scope.ptfilter.pgselect = {};*/
    $scope.searchResults = false;
    $scope.cf = countFactory;
    
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
			$scope.tr_con =data.Confidentiality;
    		$scope.tr_wt = data.WasteTransfers;
    		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
	    });
    };
    $scope.translate();
	
    $scope.$watch('prMedium', function(value){
    	if($scope.prfilter && $scope.prfilter.prsel){
    		$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watch('prfilter.pgselect', function(value){
    	if($scope.prfilter && $scope.prfilter.prsel){
    		$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watchCollection('[queryParams,prfilter]', function(value){
    	if($scope.queryParams){
//        	if($scope.queryParams && $scope.queryParams.LOV_PollutantGroupID){
    		$scope.mediumParams = angular.copy($scope.queryParams);
    		//$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watch('pritems', function(value){
    	if($scope.pritems){
    		//console.log
    	}
    });
    
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
    $scope.active.pollutantrelease = true;

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
		$scope.beforesearch = false;
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
        $scope.hasConfidential();
        
        $scope.searchResults = true;
	}
	
	$scope.hasConfidential = function(){
		$scope.hasConfidentionalData = false;
		
        var confidentialParams = angular.copy($scope.queryParams);
        if(confidentialParams.LOV_PollutantID)
        {
        	delete confidentialParams.LOV_PollutantID;
        }
        if(confidentialParams.LOV_PollutantGroupID)
        {
        	delete confidentialParams.LOV_PollutantGroupID;
        }
        confidentialParams.ConfidentialIndicator = 1;

        var rest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        // Pollutant Releases
        var isPRconfservice = rest.all('pollutantreleaseSearch');
        isPRconfservice.getList(confidentialParams).then(function(response) {
        	$scope.hasConfidentionalData = (response.data === 'true');
        });

        // Pollutant Transfers
		var isPTconfservice = rest.one('pollutanttransferIsConfidential');
		isPTconfservice.get(confidentialParams).then(function(response) {
            $scope.hasConfidentionalData = (response.data === 'true');
        });

        // Waste Transfers
		var isWTconfservice = rest.one('wastetransferIsConfidential');
		isWTconfservice.get(confidentialParams).then(function(response) {
            $scope.hasConfidentionalData = (response.data === 'true');
        });
		
	}
	
	$scope.wasteTransferDownloadData = function(){
		$scope.wasteTransferDownload= new Array();
        var add_fields = 4;
        
        $scope.topInfoDownload($scope.wasteTransferDownload);
        
        $scope.wasteTransferDownload[add_fields]= new Array();
        $scope.wasteTransferDownload[add_fields][0] = $scope.tr_wt.TransferPerIndustrialActivity;
    	$scope.wasteTransferDownload[add_fields][1] = $scope.tr_c.HazardousDomestic + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][2] = $scope.tr_c.HazardousDomestic  + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][3] = $scope.tr_c.HazardousTransboundary + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][4] = $scope.tr_c.HazardousTransboundary   + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][5] = $scope.tr_c.HazardousTotal + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][6] = $scope.tr_c.HazardousTotal   + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][7] = $scope.tr_c.NonHazardousTotal + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][8] = $scope.tr_c.NonHazardousTotal   + ' - ' + $scope.tr_c.Facilities;

    	add_fields += 1;
    	
    	var wasteTransfer = this.wasteTransferItems.sort(function(a, b) {
    	    return a.key - b.key;
    	});
    	
        for(var i =0; i<wasteTransfer.length;i++){
        	var subItems = 0;
        	var item = wasteTransfer[i];
        	$scope.wasteTransferDownload[i+add_fields]= new Array();
        	$scope.wasteTransferDownload[i+add_fields][0] = $scope.tr_laa[item.key];
        	$scope.wasteTransferDownload[i+add_fields][1] = $scope.cf.getSum(item.data,"quantityTotalHWIC",false);
        	$scope.wasteTransferDownload[i+add_fields][2] = $scope.cf.getSum(item.data,"facilityCountHWIC",false);
        	$scope.wasteTransferDownload[i+add_fields][3] = $scope.cf.getSum(item.data,"quantityTotalHWOC",true);
        	$scope.wasteTransferDownload[i+add_fields][4] = $scope.cf.getSum(item.data,"facilityCountHWOC",false);
        	$scope.wasteTransferDownload[i+add_fields][5] = $scope.cf.getSum(item.data,"quantityTotalHW",true);
        	$scope.wasteTransferDownload[i+add_fields][6] = $scope.cf.getSum(item.data,"facilityCountHW",false);
        	$scope.wasteTransferDownload[i+add_fields][7] = $scope.cf.getSum(item.data,"quantityTotalNONHW",true);
        	$scope.wasteTransferDownload[i+add_fields][8] = $scope.cf.getSum(item.data,"facilityCountNONHW",false);
        	
        	item.data.sort(function(a, b) {
        		return a.iaActivityCode - b.iaActivityCode;
        	});
        	
        	if(item.hasOwnProperty('data')){
            	for(var j =0; j<item.data.length;j++){
            		var subItem = item.data[j];
            		
            		$scope.wasteTransferDownload[i+add_fields+(++subItems)]= new Array();
                	$scope.wasteTransferDownload[i+add_fields+subItems][0] = $scope.tr_laa[subItem.iaActivityCode];
                	$scope.wasteTransferDownload[i+add_fields+subItems][1] = $scope.cf.getSum(subItem,"quantityTotalHWIC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][2] = $scope.cf.getSum(subItem,"facilityCountHWIC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][3] = $scope.cf.getSum(subItem,"quantityTotalHWOC",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][4] = $scope.cf.getSum(subItem,"facilityCountHWOC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][5] = $scope.cf.getSum(subItem,"quantityTotalHW",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][6] = $scope.cf.getSum(subItem,"facilityCountHW",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][7] = $scope.cf.getSum(subItem,"quantityTotalNONHW",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][8] = $scope.cf.getSum(subItem,"facilityCountNONHW",false);
                	
                	if(subItem.hasOwnProperty('sublevel') && subItem.sublevel instanceof Array){
                		subItem.sublevel.sort(function(a, b) {
                    	    return a.iasubActivityCode - b.iasubActivityCode;
                    	});
                		
                		for(var k =0; k< subItem.sublevel.length ;k++){
                    		var subSubItem = subItem.sublevel[k];
                    		$scope.wasteTransferDownload[i+add_fields+(++subItems)]= new Array();
                        	$scope.wasteTransferDownload[i+add_fields+subItems][0] = $scope.tr_laa[subSubItem.iaSubActivityCode];
                        	$scope.wasteTransferDownload[i+add_fields+subItems][1] = $scope.cf.getSum(subSubItem,"quantityTotalHWIC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][2] = $scope.cf.getSum(subSubItem,"facilityCountHWIC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][3] = $scope.cf.getSum(subSubItem,"quantityTotalHWOC",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][4] = $scope.cf.getSum(subSubItem,"facilityCountHWOC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][5] = $scope.cf.getSum(subSubItem,"quantityTotalHW",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][6] = $scope.cf.getSum(subSubItem,"facilityCountHW",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][7] = $scope.cf.getSum(subSubItem,"quantityTotalNONHW",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][8] = $scope.cf.getSum(subSubItem,"facilityCountNONHW",false);
                		}
                	}
            	}
        	}
        	add_fields += subItems+1;
        }
        
        add_fields = $scope.wasteTransferDownload.length+1;

        $scope.wasteTransferDownload[add_fields]= new Array();
        $scope.wasteTransferDownload[add_fields][0] = $scope.tr_c.Total;
        $scope.wasteTransferDownload[add_fields][1] = wasteTransfer.totalHWIC;
        $scope.wasteTransferDownload[add_fields][2] = wasteTransfer.facilityCountHWIC;
        $scope.wasteTransferDownload[add_fields][3] = wasteTransfer.totalHWOC;
        $scope.wasteTransferDownload[add_fields][4] = wasteTransfer.facilityCountHWOC;
        $scope.wasteTransferDownload[add_fields][5] = wasteTransfer.totalHW;
        $scope.wasteTransferDownload[add_fields][6] = wasteTransfer.facilityCountHW;
        $scope.wasteTransferDownload[add_fields][7] = wasteTransfer.totalNONHW;
        $scope.wasteTransferDownload[add_fields][8] = wasteTransfer.facilityCountNONHW;
	}

	$scope.topInfoDownload = function(array){
		for(var i=0;i<$scope.headitms.length;i++){
			array[i]= new Array();
			array[i][0] = $scope.headitms[i].title;
			array[i][1] = $scope.headitms[i].val;
		}
	}
}])

;