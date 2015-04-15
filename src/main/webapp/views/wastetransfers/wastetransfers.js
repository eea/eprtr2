'use strict';

angular.module('myApp.wastetransfers', ['ngRoute','googlechart', 'myApp.search-filter', 'restangular','ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wastetransfers', {
            templateUrl: 'views/wastetransfers/wastetransfers.html',
            controller: 'WasteTransfersCtrl'
        });
    }])

    .controller('WasteTransfersCtrl', ['$scope', '$filter', 'searchFilter', 'Restangular','translationService','formatStrFactory', function($scope, $filter, searchFilter, Restangular,translationService,formatStrFactory) {
        $scope.wastePanel = true;
        $scope.searchFilter = searchFilter;
        $scope.queryParams = {};
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
            
            // Create confidential search
            $scope.confidentialParams = angular.copy(queryParams);
            $scope.confidentialParams.ConfidentialIndicator = 1;
            
            $scope.getData($scope.queryParams);
                 
            /*facilitySearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });*/
                      
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
        	if(type.toUpperCase() === "FACILITIES" && $scope.facilitiesItems.length != 0)
        	{
        		return;
        	}
        
        	$scope.getData($scope.queryParams);
        };
        
        $scope.getData = function(params){
        	$scope.facilitySearch.getList(params).then(function(response) {
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
       		if($scope.summaryItems[i].total > 0)
       		{
       			$scope.summaryItems[i].rpct = Math.round((($scope.summaryItems[i].recovery * 100 / $scope.summaryItems[i].total)*100)) /100;
       			$scope.summaryItems[i].dpct = Math.round((($scope.summaryItems[i].disposal * 100 / $scope.summaryItems[i].total)*100)) /100;
       			$scope.summaryItems[i].upct = Math.round((($scope.summaryItems[i].unspec * 100 / $scope.summaryItems[i].total)*100)) /100;
       			formatStrFactory.getStrFormat($scope.summaryItems[i].recovery);
       		}else
       		{
       			$scope.summaryItems[i].rpct = 0.0;
       			$scope.summaryItems[i].dpct = 0.0;
       			$scope.summaryItems[i].upct = 0.0;
       		}
       		$scope.summaryItems[i].wastetype = $scope.tr_lovwt[$scope.summaryItems[i].wastetype]
          }
       	  // Create grafs
       	  var graphData = {};
       	  var graphData2 = {};
       	  
          for (var i = 0; i < $scope.summaryItems.length; i++) {
              // Create graph data
        	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["NON-HW"]) {
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
                     {v: $scope.summaryItems[i].recovery}]};
        		  graphData2[$scope.tr_wt["DisposalDomestic"]] = {c: [
                    {v: $scope.tr_wt["DisposalDomestic"]},
                    {v: $scope.summaryItems[i].disposal}]};
        		  graphData2[$scope.tr_wt["UnspecifiedDomestic"]] = {c: [
                        {v: $scope.tr_wt["UnspecifiedDomestic"]},
                        {v: $scope.summaryItems[i].unspec}]};
        	  }
        	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["HWOC"]) {
        		  graphData2[$scope.tr_wt["RecoveryTransboundary"]] = {c: [
                         {v: $scope.tr_wt["RecoveryTransboundary"]},
                         {v: $scope.summaryItems[i].recovery}]};
        		  graphData2[$scope.tr_wt["DisposalTransboundary"]] = {c: [
                    {v: $scope.tr_wt["DisposalTransboundary"]},
                    {v: $scope.summaryItems[i].disposal}]};
        		  graphData2[$scope.tr_wt["UnspecifiedTransboundary"]] = {c: [
                    {v: $scope.tr_wt["UnspecifiedTransboundary"]},
                    {v: $scope.summaryItems[i].unspec}]};
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
        
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = angular.copy($scope.items);
          	$scope.totalactivitiesfac = $scope.getTotalCount("activities","facilityCount");
        	$scope.totaltHWIC = $scope.getSumTotal("activities","quantityTotalHWIC");
        	$scope.totalrHWIC = $scope.getSumTotal("activities","quantityRecoveryHWIC");
        	$scope.totaldHWIC = $scope.getSumTotal("activities","quantityDisposalHWIC");
        	$scope.totaluHWIC = $scope.getSumTotal("activities","quantityUnspecHWIC");
        	
        	$scope.totaltHWOC = $scope.getSumTotal("activities","quantityTotalHWOC");
        	$scope.totalrHWOC = $scope.getSumTotal("activities","quantityRecoveryHWOC");
        	$scope.totaldHWOC = $scope.getSumTotal("activities","quantityDisposalHWOC");
        	$scope.totaluHWOC = $scope.getSumTotal("activities","quantityUnspecHWOC");
        	
        	$scope.totalthaz = $scope.getSumTotal("activities","total");
        	$scope.totalrhaz = $scope.getSumTotal("activities","recovery");
        	$scope.totaldhaz = $scope.getSumTotal("activities","disposal");
        	$scope.totaluhaz = $scope.getSumTotal("activities","unspec");
        	
        	$scope.totaltNONHW = $scope.getSumTotal("activities","quantityTotalNONHW");
        	$scope.totalrNONHW = $scope.getSumTotal("activities","quantityRecoveryNONHW");
        	$scope.totaldNONHW = $scope.getSumTotal("activities","quantityDisposalNONHW");
        	$scope.totaluNONHW = $scope.getSumTotal("activities","quantityUnspecNONHW");
        	
        };
        
        $scope.updateAreasData = function()
        {
        	$scope.areas = angular.copy($scope.items);
         	$scope.totalareasfac = $scope.getTotalCount("areas","facilityCount");
        	$scope.totalareastHWIC = $scope.getSumTotal("areas","quantityTotalHWIC");
        	$scope.totalareasrHWIC = $scope.getSumTotal("areas","quantityRecoveryHWIC");
        	$scope.totalareasdHWIC = $scope.getSumTotal("areas","quantityDisposalHWIC");
        	$scope.totalareasuHWIC = $scope.getSumTotal("areas","quantityUnspecHWIC");
        	
        	$scope.totalareastHWOC = $scope.getSumTotal("areas","quantityTotalHWOC");
        	$scope.totalareasrHWOC = $scope.getSumTotal("areas","quantityRecoveryHWOC");
        	$scope.totalareasdHWOC = $scope.getSumTotal("areas","quantityDisposalHWOC");
        	$scope.totalareasuHWOC = $scope.getSumTotal("areas","quantityUnspecHWOC");
        	
        	$scope.totalareasthaz = $scope.getSumTotal("areas","total");
        	$scope.totalareasrhaz = $scope.getSumTotal("areas","recovery");
        	$scope.totalareasdhaz = $scope.getSumTotal("areas","disposal");
        	$scope.totalareasuhaz = $scope.getSumTotal("areas","unspec");
        	
        	$scope.totalareastNONHW = $scope.getSumTotal("areas","quantityTotalNONHW");
        	$scope.totalareasrNONHW = $scope.getSumTotal("areas","quantityRecoveryNONHW");
        	$scope.totalareasdNONHW = $scope.getSumTotal("areas","quantityDisposalNONHW");
        	$scope.totalareasuNONHW = $scope.getSumTotal("areas","quantityUnspecNONHW");
        	
        };
        
        $scope.updateAreaComparisonData = function()
        {
        	// Graph
        };
        
        $scope.updateFacilitiesData = function()
        {
        	
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
        
        $scope.findGroup = function(collection,key)
        {
        	for(var i = 0; i < collection.length;i++)
        	{
        		if(collection[i].key === key)
        		{
        			return collection[i];
        		}
        	}
        };
        
        $scope.getTypeCount = function(elements){  
            
        	if(!elements.length)
        	{
        		elements = jQuery.makeArray(elements);
        	}  
            var total = 0;
            for(var i = 0; i < elements.length; i++){
                	total += elements[i].facilityCount;
             
            }
            return total;
        };
        
        $scope.getTotalCount = function(type,property)
        {
        	var count = 0;
        	switch(type.toLocaleLowerCase())
        	{
        		case "activities":
        			for(var i = 0; i < $scope.activities.length; i++ )
        			{
        				for(var j = 0; j < $scope.activities[i].data.length; j++)
        				{
        					if($scope.activities[i].data[j][property]);
        					{
        						count+=	$scope.activities[i].data[j][property];
        					}
        				}
        			}
        			break;
        		case "areas":
        			for(var i = 0; i < $scope.areas.length; i++ )
        			{
        				for(var j = 0; j < $scope.areas[i].data.length; j++)
        				{
        					if($scope.areas[i].data[j][property]);
        					{
        						count+=	$scope.areas[i].data[j][property];
        					}
        				}
        			}
        			break;
        		default:
        			break;
        	}
        	return count;
        };
        
        $scope.getformat = function(value)
        {
     		if(value === 0)
    		{
    			return "-";
    		}
    		return formatStrFactory.getStrFormat(value);
        };
        
        $scope.getpctformat = function(value)
        {
     		if(value === 0)
    		{
    			return "-";
    		}
    		return value+"%";
        };
        
        
        $scope.getSum = function(elements, type)
        {
        	if(!elements.length)
        	{
        		elements = jQuery.makeArray(elements);
        	}
        	var sum = 0;
    		for(var i = 0; i < elements.length; i++)
			{
				 var temp = elements[i][type];
				 if(temp)
				 {
					 sum += temp;
				 }
			}
    		if(sum === 0)
    		{
    			return "-";
    		}
    		return formatStrFactory.getStrFormat(sum);
        };
        
        $scope.getSumTotal = function(type,property1)
        {
        	var sumtotal = 0;
        	switch(type.toLocaleLowerCase())
        	{
        		case "activities":
        			for(var i = 0; i < $scope.activities.length; i++ )
        			{
        				for(var j = 0; j < $scope.activities[i].data.length; j++)
        				{
        					if($scope.activities[i].data[j][property1]);
        					{
        						sumtotal+= $scope.activities[i].data[j][property1];
        					}
        					
        				}
        			}
        			break;
        		case "areas":
        			for(var i = 0; i < $scope.areas.length; i++ )
        			{
        				for(var j = 0; j < $scope.areas[i].data.length; j++)
        				{
        					if($scope.areas[i].data[j][property1]);
        					{
        						sumtotal+= $scope.areas[i].data[j][property1];
        					}
        				}
        			}
        			break;
        		default:
        			break;
        	}
        	return formatStrFactory.getStrFormat(sumtotal);
        };
        
       
    }])
;