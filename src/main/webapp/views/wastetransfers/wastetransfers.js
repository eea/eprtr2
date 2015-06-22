'use strict';

angular.module('myApp.wastetransfers', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize',
                                        'myApp.wastetransferconfidential','myApp.wasteAreaComparison'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wastetransfers', {
            templateUrl: 'views/wastetransfers/wastetransfers.html',
            controller: 'WasteTransfersCtrl'
        });
    }])

    .controller('WasteTransfersCtrl', ['$scope', '$filter', '$modal', 'searchFilter', 'Restangular',
                                       'translationService','formatStrFactory','countFactory', function($scope, $filter, $modal, 
                                    		   searchFilter, Restangular,translationService,formatStrFactory,countFactory) {
        $scope.wastePanel = true;
        $scope.searchFilter = searchFilter;
        $scope.ff = formatStrFactory;
        $scope.cf = countFactory;
        $scope.isConfidential = false;
        $scope.queryParams = {};
        $scope.wtfilter = {};
        $scope.wtconfcoll = [];
        $scope.wtconfreasoncoll = [];
        $scope.queryParams.ReportingYear = -1;
        $scope.SearchType="SUMMARY";
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
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        	  });
        };
        $scope.translate();
        
        /**
         * Tab handling
         * */
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

    	/**
    	 * Facility Table functions
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

    $scope.$watch('wtfilter.wtsel', function(value) {
    	if ($scope.currentSearchFilter !== undefined && $scope.wtfilter.wtsel != undefined) {
    		//$scope.queryParams.WasteTypeCode = [$scope.wtfilter.wtsel];
/*        	$scope.SearchType = "FACILITIES";
        	$scope.queryParams.SearchType="FACILITIES";*/
        	var qp = angular.copy($scope.queryParams);
       		qp.WasteTypeCode = [value.replace('-','')];
        	$scope.getData(qp);
    	}
    });

    $scope.hasItems = function() {
    	return $scope.items.length > 0;
    };

    /**
     * Search functions
     */
    	
        $scope.resetSearch = function()
        {
        	$scope.summaryItems = [];
        	$scope.activities = [];
          	$scope.areas = [];
          	$scope.areaComparisonItems = [];
          	$scope.facilitiesItems = [];
          	
        };
        
        $scope.resetSearch();
        
        $scope.search = function() {
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.currentPage = 1;
            $scope.sort.sortingOrder = 'facilityName';
            $scope.sort.reverse = false;
            $scope.performSearch();
        };
            
        $scope.performSearch = function() {
        	$scope.resetSearch();
        	var rest = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
            $scope.regionSearch = false;
            
            $scope.facilitySearch = rest.all('wastetransferSearch');
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
            if ($scope.currentSearchFilter.wasteSearchFilter) {
                $scope.currentSearchFilter.wasteSearchFilter.filter(queryParams);
            }
            
            if(searchFilter.regionType == 0)
            {
            	$scope.regionSearch = true;
            }else
            {
            	$scope.regionSearch = false;
            }
            
            queryParams.RegionSearch = $scope.regionSearch;
            
            // SearchType
            queryParams.SearchType= $scope.SearchType;

            $scope.queryParams = queryParams;
            
        	if(queryParams.SearchType === "FACILITIES")
        	{
            	if ($scope.wtfilter.wtsel != undefined) {
            		queryParams.WasteTypeCode = [$scope.wtfilter.wtsel.replace('-','')];
            	}
        		queryParams.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
        		queryParams.limit = $scope.itemsPerPage;
        		queryParams.order = $scope.sort.sortingOrder;
        		queryParams.desc = $scope.sort.reverse;
        	}


        	// Create confidential search
            $scope.confidentialParams = angular.copy(queryParams);
            $scope.confidentialParams.ConfidentialIndicator = 1;
            
            $scope.getData(queryParams);
            $scope.getIsConfidential();
                 
            /*facilitySearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });*/
                      
        };
        
        $scope.getIsConfidential = function(){
			var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'WasteTypeCode') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
			var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
			var isconfservice = rest.one('wastetransferIsConfidential');
			isconfservice.get(qp).then(function(response) {
	            $scope.isConfidential = (response.data === 'true');
	        });
        };
        $scope.getTabData = function(type)
        {
        
        	if(!$scope.queryParams.SearchType)
        	{
        		// No search done
        		return;
        	}
        	$scope.SearchType = type;
        	$scope.queryParams.SearchType=type;
        	var qp = angular.copy($scope.queryParams);
        	if(type.toUpperCase() === "SUMMARY" && $scope.summaryItems.length != 0)
        	{
        		return;
        	}
        	if(type.toUpperCase() === "ACTIVITIES" && $scope.activities.length != 0)
        	{
        		return;
        	}
        	if(type.toUpperCase() === "AREAS" && $scope.areas.length != 0)
        	{
        		return;
        	}
        	if(type.toUpperCase() === "AREACOMPARISON" )
        	{
        		//$scope.areacomparisonrefresh = true;
        	}
        	
        	areacomparisonrefresh
        	if(type.toUpperCase() === "FACILITIES")
        	{

            	if($scope.facilitiesItems.length != 0)
            	{
            		return;

            	}
            	else{
                	if ($scope.wtfilter.wtsel != undefined) {
                		qp.WasteTypeCode = [$scope.wtfilter.wtsel.replace('-','')];
                	}
                	qp.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
                	qp.limit = $scope.itemsPerPage;
                	qp.order = $scope.sort.sortingOrder;
                	qp.desc = $scope.sort.reverse;
            	}
        	}
        
        	$scope.getData(qp);
        };
        
        $scope.getData = function(qp){
        	$scope.facilitySearch.getList(qp).then(function(response) {
        		$scope.items = response.data;  
    			switch($scope.queryParams.SearchType.toUpperCase())
                  {
                  	case "SUMMARY":
                  		$scope.updateSummaryData();
                  		break;
                  	case "ACTIVITIES":
                  		$scope.updateActivitiesData();
                  		break;
                  	case "AREAS":
                  	    $scope.updateAreasData();
                  		break;
                  	case "FACILITIES":
                  		//Get Total count
                	   $scope.totalItemCount = response.headers('X-Count');
                  	   $scope.updateFacilitiesData();
                  		break;
                  	case "TODO":
                  		 $scope.updateHazboundData();
                  		break;
                  	case "TODO1":
                  		 $scope.updateRecData();
                 		break;
                  	default:
                  		// No valid search
                  		break;
                  }
              });
        };
        
        
        $scope.updateSummaryData = function() {
       	  $scope.summaryItems = angular.copy($scope.items);
       	  
       	 	// Handle data
       	  for(var i = 0; i <$scope.summaryItems.length;i++)
          {
       		if($scope.summaryItems[i].quantityTotal > 0)
       		{
       			$scope.summaryItems[i].rpct = Math.round((($scope.summaryItems[i].quantityRecovery * 100 / $scope.summaryItems[i].quantityTotal)*100)) /100;
       			$scope.summaryItems[i].dpct = Math.round((($scope.summaryItems[i].quantityDisposal * 100 / $scope.summaryItems[i].quantityTotal)*100)) /100;
       			$scope.summaryItems[i].upct = Math.round((($scope.summaryItems[i].quantityUnspec * 100 / $scope.summaryItems[i].quantityTotal)*100)) /100;
       			formatStrFactory.getStrFormat($scope.summaryItems[i].quantityRecovery);
       		}else
       		{
       			$scope.summaryItems[i].rpct = 0.0;
       			$scope.summaryItems[i].dpct = 0.0;
       			$scope.summaryItems[i].upct = 0.0;
       		}
   			$scope.summaryItems[i].wt = $scope.summaryItems[i].wastetype
       		$scope.summaryItems[i].wastetype = $scope.tr_lovwt[$scope.summaryItems[i].wastetype]
          }
       	  // Create grafs
       	  var graphData = {};
       	  var graphData2 = {};
       	  
          for (var i = 0; i < $scope.summaryItems.length; i++) {
              // Create graph data
        	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["NONHW"]) {
                  graphData[$scope.tr_wt["Recovery"]] = {c: [
                      {v: $scope.tr_wt["Recovery"]},
                      {v: $scope.summaryItems[i].rpct}]};
                  graphData[$scope.tr_wt["Disposal"]] = {c: [
                     {v: $scope.tr_wt["Disposal"]},
                     {v: $scope.summaryItems[i].dpct}]};
                  graphData[$scope.tr_wt["Unspecified"]] = {c: [
                     {v: $scope.tr_wt["Unspecified"]},
                     {v: $scope.summaryItems[i].upct}]};
              }
        	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["HWIC"]) {
        		  graphData2[$scope.tr_wt["RecoveryDomestic"]] = {c: [
                     {v: $scope.tr_wt["RecoveryDomestic"]},
                     {v: $scope.summaryItems[i].quantityRecovery}]};
        		  graphData2[$scope.tr_wt["DisposalDomestic"]] = {c: [
                    {v: $scope.tr_wt["DisposalDomestic"]},
                    {v: $scope.summaryItems[i].quantityDisposal}]};
        		  graphData2[$scope.tr_wt["UnspecifiedDomestic"]] = {c: [
                        {v: $scope.tr_wt["UnspecifiedDomestic"]},
                        {v: $scope.summaryItems[i].quantityUnspec}]};
        	  }
        	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["HWOC"]) {
        		  graphData2[$scope.tr_wt["RecoveryTransboundary"]] = {c: [
                         {v: $scope.tr_wt["RecoveryTransboundary"]},
                         {v: $scope.summaryItems[i].quantityRecovery}]};
        		  graphData2[$scope.tr_wt["DisposalTransboundary"]] = {c: [
                    {v: $scope.tr_wt["DisposalTransboundary"]},
                    {v: $scope.summaryItems[i].quantityDisposal}]};
        		  graphData2[$scope.tr_wt["UnspecifiedTransboundary"]] = {c: [
                    {v: $scope.tr_wt["UnspecifiedTransboundary"]},
                    {v: $scope.summaryItems[i].quantityUnspec}]};
        	  }          
          }

     
          var graphDataArray2 = [];
          for (var key in graphData2) {
              if (graphData2.hasOwnProperty(key)) {
                  graphDataArray2 = graphDataArray2.concat(graphData2[key]);
              }
          }

          $scope.summaryChartObject2 = {};
          $scope.summaryChartObject2.data = {
                  "cols": [
                      {id: "t", label: "Name", type: "string"},
                      {id: "s", label: "Total", type: "number"}
                  ],
                  "rows": graphDataArray2
              };
          $scope.summaryChartObject2.options = {"title":$scope.tr_c["HazardousWwaste"],"sliceVisibilityThreshold": 0};
          $scope.summaryChartObject2.type = 'PieChart';
          
          var graphDataArray = [];
          for (var key in graphData) {
              if (graphData.hasOwnProperty(key)) {
                  graphDataArray = graphDataArray.concat(graphData[key]);
              }
          }
          $scope.summaryChartObject1 = {};
          $scope.summaryChartObject1.data = {
              "cols": [
                  {id: "t", label: "Name", type: "string"},
                  {id: "s", label: "Total", type: "number"}
              ],
              "rows": graphDataArray
          };
          $scope.summaryChartObject1.options = {"title":$scope.tr_wt["Nonhazardouswaste"],"sliceVisibilityThreshold": 0};
          $scope.summaryChartObject1.type = 'PieChart';
        };
        
        /**
         * Activities
         */
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = angular.copy($scope.items);
          	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"facilityCount",false);
        	$scope.totaltHWIC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWIC",true);
        	$scope.totalrHWIC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWIC",true);
        	$scope.totaldHWIC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWIC",true);
        	$scope.totaluHWIC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWIC",true);
        	
        	$scope.totaltHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC",true);
        	$scope.totalrHWOC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWOC",true);
        	$scope.totaldHWOC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWOC",true);
        	$scope.totaluHWOC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWOC",true);
        	
        	$scope.totalthaz = $scope.cf.getSubSum($scope.activities,"quantityTotalHW",true);
        	$scope.totalrhaz = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHW",true);
        	$scope.totaldhaz = $scope.cf.getSubSum($scope.activities,"quantityDisposalHW",true);
        	$scope.totaluhaz = $scope.cf.getSubSum($scope.activities,"quantityUnspecHW",true);
        	
        	$scope.totaltNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW",true);
        	$scope.totalrNONHW = $scope.cf.getSubSum($scope.activities,"quantityRecoveryNONHW",true);
        	$scope.totaldNONHW = $scope.cf.getSubSum($scope.activities,"quantityDisposalNONHW",true);
        	$scope.totaluNONHW = $scope.cf.getSubSum($scope.activities,"quantityUnspecNONHW",true);
        	
        };
        
        $scope.updateAreasData = function()
        {
        	$scope.areas = angular.copy($scope.items);
         	$scope.totalareasfac = $scope.cf.getSubSum($scope.areas,"facilityCount");
        	$scope.totalareastHWIC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWIC",true);
        	$scope.totalareasrHWIC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWIC",true);
        	$scope.totalareasdHWIC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWIC",true);
        	$scope.totalareasuHWIC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWIC",true);
        	
        	$scope.totalareastHWOC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWOC",true);
        	$scope.totalareasrHWOC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWOC",true);
        	$scope.totalareasdHWOC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWOC",true);
        	$scope.totalareasuHWOC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWOC",true);
        	
        	$scope.totalareasthaz = $scope.cf.getSubSum($scope.areas,"quantityTotalHW",true);
        	$scope.totalareasrhaz = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHW",true);
        	$scope.totalareasdhaz = $scope.cf.getSubSum($scope.areas,"quantityDisposalHW",true);
        	$scope.totalareasuhaz = $scope.cf.getSubSum($scope.areas,"quantityUnspecHW",true);
        	
        	$scope.totalareastNONHW = $scope.cf.getSubSum($scope.areas,"quantityTotalNONHW",true);
        	$scope.totalareasrNONHW = $scope.cf.getSubSum($scope.areas,"quantityRecoveryNONHW",true);
        	$scope.totalareasdNONHW = $scope.cf.getSubSum($scope.areas,"quantityDisposalNONHW",true);
        	$scope.totalareasuNONHW = $scope.cf.getSubSum($scope.areas,"quantityUnspecNONHW",true);
        	$scope.setAreaRegion();
        };
        
        $scope.updateAreaComparisonData = function()
        {
        	// Graph
        };
        
        $scope.updateFacilitiesData = function()
        {
        	$scope.facilitiesItems  = angular.copy($scope.items);
        };
        
        $scope.updateHazboundData = function()
        {
        	//Graph
        };
        
        $scope.updateRecData = function()
        {
        	
        };
        
        $scope.updateConfidentialityData = function()
        {
        	
        };
        
        $scope.setAreaRegion = function(){
			if ($scope.areas.length >0 )
			{
				//Grouped by Region 
				if($scope.regionSearch){
        			for(var i = 0; i < $scope.areas.length; i++ )
        			{
            			for(var j = 0; j < $scope.areas[i].data.length; j++ )
            			{
	        				//Takes id from object if exists
							if ($scope.areas[i].data[j].lov_NUTSRegionID == undefined){
								if ($scope.areas[i].data[j].lov_NUTSRLevel3ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].lov_NUTSRLevel3ID;
								}
								else if ($scope.areas[i].data[j].lov_NUTSRLevel2ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].lov_NUTSRLevel2ID;
								}
								else if ($scope.areas[i].data[j].lov_NUTSRLevel1ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].lov_NUTSRLevel1ID;
								}
							}
	        				//Else we take id from child if exists
							if ($scope.areas[i].data[j].lov_NUTSRegionID == undefined){
								if ($scope.areas[i].data[j].data[0].lov_NUTSRLevel3ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].data[0].lov_NUTSRLevel3ID;
								}
								else if ($scope.areas[i].data[j].data[0].lov_NUTSRLevel2ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].data[0].lov_NUTSRLevel2ID;
								}
								else if ($scope.areas[i].data[j].data[0].lov_NUTSRLevel1ID != null){
									$scope.areas[i].data[j].lov_NUTSRegionID = $scope.areas[i].data[j].data[0].lov_NUTSRLevel1ID;
								}
							}
							$scope.areas[i].data[j].riverBasinDistrictCode = null;
							$scope.areas[i].data[j].lov_RiverBasinDistrictID = null;
	        			}
        			}
				}
				//Grouped by River basin district 
				else{
        			for(var i = 0; i < $scope.areas.length; i++ )
        			{
            			for(var j = 0; j < $scope.areas[i].data.length; j++ )
            			{
            				if ($scope.areas[i].data[j].lov_RiverBasinDistrictID == undefined){
								if ($scope.areas[i].data[j].data[0].lov_RiverBasinDistrictID != undefined){
									$scope.areas[i].data[j].LOV_RiverBasinDistrictID = $scope.areas[i].data[j].data[0].lov_RiverBasinDistrictID;
								}
            				}
							$scope.areas[i].data[j].nutslevel2RegionCode = null;
							$scope.areas[i].data[j].lov_NUTSRegionID = null;
            			}
        			}
				}
			}
        };
        
        
        
        /**
         * TimeSeries Modal popup
         */
        $scope.openActTSmodal = function (lov_IASectorID, lov_IAActivityID, lov_IASubActivityID) {
        	var ct = 'wastetransfer';
        	/*Convert item into Query params*/
        	var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'LOV_IASectorID' && key != 'LOV_IAActivityID' && key != 'LOV_IASubActivityID') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
        	
        	if(lov_IASectorID !== null)
        		{qp.LOV_IASectorID = lov_IASectorID;}
        	if(lov_IAActivityID !== null)
    			{qp.LOV_IAActivityID = lov_IAActivityID;}
        	if(lov_IASubActivityID !== null)
				//record.iasubActivityCode = "unspecified";

    			{qp.LOV_IASubActivityID = lov_IASubActivityID;}
 
        	//$scope.qp = qp;
/*        	 BootstrapDialog.show({
                 message: $('<div></div>').load('components/timeseries/tsmodal.html'),
                 data: {
                     'isoContType': ct,
                     'isoQP': qp
                 }
        	 });*/
             
        	$scope.tsopen(ct,qp);
        };
        
        $scope.openAreaTSmodal = function (lov_CountryID, lov_NUTSRegionID, lov_RiverBasinDistrictID) {
        	var ct = 'wastetransfer';
        	/*Convert item into Query params*/
        	var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'lov_RiverBasinDistrictID' && key != 'lov_NUTSRegionID' && key != 'lov_CountryID') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
        	
        	if(lov_CountryID !== null)
        		{qp.LOV_CountryID = lov_CountryID;}
        	if(lov_NUTSRegionID !== null)
    			{qp.LOV_NUTSRegionID = lov_NUTSRegionID;}
        	if(lov_RiverBasinDistrictID !== null)
    			{qp.LOV_RiverBasinDistrictID = lov_RiverBasinDistrictID;}
 
        	$scope.tsopen(ct,qp);
        };
            
        $scope.openSumTSmodal = function(WasteTypeCode){
        	var ct = 'wastetransfer';
        	/*Convert item into Query params*/
        	var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'wasteTypeCode') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
        	
        	if(WasteTypeCode !== null)
        		{qp.WasteTypeCode = WasteTypeCode.replace('-','');}
        	$scope.tsopen(ct,qp);
        };
        
        $scope.tsopen = function(ct,qp){
        	var modalInstance = $modal.open({
                templateUrl: 'components/timeseries/tsmodal.html',
                controller: 'ModalTimeSeriesCtrl',
//                size: size,
                resolve: {
              	  isoContType: function () {
              		  return ct;
              	  },
                 	  isoQP: function () {
              		  return qp;
              	  }
           
                }
              });
        };
 
       
    }])

;