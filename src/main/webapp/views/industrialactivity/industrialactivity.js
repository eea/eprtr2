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
        $scope.regionSearch = false;
        $scope.summaryItems = [];
        $scope.pollutantreleaseItems = [];
        $scope.pollutanttransferItems = [];
        $scope.summaryItems = [];
        $scope.sectorIA ="";
        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

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
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        	  });
        };
        $scope.translate();
        
        $scope.search = function() {
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.performSearch();
        };
        
        /*Need to do all in on search*/
        $scope.performSearch = function() {
             
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
            
            if($scope.currentSearchFilter.activitySearchFilter.selectedSectors[0].code)
            {
            	$scope.sectorIA = $scope.tr_laa[$scope.currentSearchFilter.activitySearchFilter.selectedSectors[0].code];
            }else
            {
            	$scope.sectorIA = $scope.tr_c["AllSectors"];
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
            
            $scope.getTabData("pollutantrelease");
            $scope.getTabData("pollutanttransfer");
            $scope.getTabData("wastetransfer");
                      
        };
        
        $scope.getTabData = function(type)
        {
        	switch(type.toLowerCase())
        	{
	        	case "pollutantrelease":
	        		$scope.searchService = $scope.restconfig.all('pollutantreleaseSearch');
	        	    // SearchType
	        		var params = angular.copy($scope.queryParams);
	        		params.SearchType="POLLUTANTRELEASESUM";
	        		$scope.getData(params);
	        		break;
	        	case "pollutanttransfer":
	        		$scope.searchService = $scope.restconfig.all('pollutanttransferSearch');
	        		var params = angular.copy($scope.queryParams);
	        		params.SearchType="POLLUTANTTRANSFERSUM";
	        		$scope.getData(params);
	        		break;
	        	case "wastetransfer":
	        		$scope.searchService = $scope.restconfig.all('wastetransferSearch');
	        		var params = angular.copy($scope.queryParams);
	        		params.SearchType="SUMMARY";
	        		$scope.getData(params);
	        		break;
	        	case "confidentiality":
	        		// TODO
	        		break;
	        	default:
	        		break;
        	}
        };
        
        $scope.getData = function(params){
        	$scope.searchService.getList(params).then(function(response) {
        		$scope.items = response.data;  
    			switch(params.SearchType.toUpperCase())
    			{
    				case "POLLUTANTRELEASESUM":
    					$scope.updatePollutantReleaseData();
    					break;
    				case "POLLUTANTTRANSFERSUM":
    					$scope.updatePollutantTransferData();
    					break;
                  	case "SUMMARY":
                  		$scope.updateSummaryData();
                  		break;
                  	default:
                  		// No valid search
                  		break;
                  }
              });
        };
        
        $scope.updatePollutantReleaseData = function()
        {
        	$scope.pollutantreleaseItems = angular.copy($scope.items);
        };
        
        $scope.updatePollutantTransferData = function()
        {
        	$scope.pollutanttransferItems = angular.copy($scope.items);
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
            $scope.summaryChartObject2.options = {"title":$scope.tr_c["HazardousWwaste"],"sliceVisibilityThreshold": 0,"height": 300};
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
            $scope.summaryChartObject1.options = {"title":$scope.tr_wt["Nonhazardouswaste"],"sliceVisibilityThreshold": 0,"height": 300};
            $scope.summaryChartObject1.type = 'PieChart';
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
          
          $scope.getTypeCountAccidential = function(elements){  
              
            	if(!elements.length)
            	{
            		elements = jQuery.makeArray(elements);
            	}  
                var total = 0;
                for(var i = 0; i < elements.length; i++){
                    	total += elements[i].facilityAccidentalCount; 
                }
                return total;
            };
          
          $scope.getformat = function(value)
          {
       		if(!value || value === 0)
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
          
        
        
    }])
;