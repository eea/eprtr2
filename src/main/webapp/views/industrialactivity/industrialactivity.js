'use strict';

angular.module('myApp.industrialactivity', ['ngRoute','googlechart', 'myApp.search-filter', 'restangular','ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/industrialactivity', {
            templateUrl: 'views/industrialactivity/industrialactivity.html',
            controller: 'IndustrialActivityCtrl'
        });
    }])

    .controller('IndustrialActivityCtrl', ['$scope', '$filter', '$modal','searchFilter', 'Restangular','translationService'
                                           ,'formatStrFactory', 'countFactory', 
                                           function($scope, $filter, $modal, searchFilter, Restangular,translationService,formatStrFactory,countFactory) {
        $scope.activityPanel = true;
        $scope.searchFilter = searchFilter;
        $scope.queryParams = {};
        $scope.queryParams.ReportingYear = -1;
        $scope.regionSearch = false;
        //$scope.summaryItems = [];
        $scope.pollutantreleaseItems = [];
        $scope.pollutanttransferItems = [];
        $scope.itemsConfidentiality =[];
        $scope.itemCon = [];
        $scope.itemConReason = [];
        $scope.summaryItems = [];
        $scope.sectorIA ="";
        $scope.totalSearchResult = 0;
        $scope.cf = countFactory;
        
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

    	$scope.showresult = function(value)
        {
        	if($scope.itemsConfidentiality)
        	{
            	$scope.showConfidential = value;
        		$scope.updateConfidentialData();
        	}
        };
        
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
            $scope.totalSearchResult = 0;
        	$scope.showConfidential = 'polRelease';
            $scope.getTabData("pollutantrelease");
            $scope.getTabData("pollutanttransfer");
            $scope.getTabData("wastetransfer");
            $scope.getTabData("confidentiality");
                      
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
	        		$scope.searchService = $scope.restconfig.all('confindustrialactivitySearch');
	        		var params = angular.copy($scope.queryParams);
	        		params.SearchType="ALLCONF";
	        		$scope.getData(params);
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
    					$scope.pollutantreleaseItems = response.data;
    					$scope.polreleasecount = response.headers('facilitiesCount');
    					$scope.totalSearchResult += parseInt($scope.polreleasecount);
    					$scope.updatePollutantReleaseData();
    					break;
    				case "POLLUTANTTRANSFERSUM":
    					$scope.pollutanttransferItems = response.data;
    					$scope.poltransfercount = response.headers('facilitiesCount');
    					$scope.totalSearchResult += parseInt($scope.poltransfercount);
    					$scope.updatePollutantTransferData();
    					break;
                  	case "SUMMARY":
                  		$scope.summaryItems = response.data;
                  		$scope.wastetransfercount = response.headers('facilitiesCount');
                  		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
                  		$scope.updateSummaryData();
                  		break;
                  	case "ALLCONF":
                  		$scope.itemsConfidentiality = response.data;
                  		$scope.updateConfidentialData();
                  		break;
                  	default:
                  		// No valid search
                  		break;
                  }
              });
        };
        
        $scope.updateConfidentialData = function()
        {
        	$scope.hasConfidentionalData = $scope.itemsConfidentiality.length > 0? true: false;
        	
        	$scope.itemCon = [];
        	$scope.itemConReason = [];
        	
        	switch($scope.showConfidential)
        	{
	        	case "polRelease":
		        	// Confidential
		        	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) { 		
		        		if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "polrelease")
		        		{
		        			continue;
		        		}
		        		var conObj =_.find($scope.itemCon, function(element){ return element.pollutantCode === ($scope.itemsConfidentiality[i].pollutantCode + ".Confidential") });       		
		        		if(!conObj)
		        		{
		        			var polutent = {};
		        			polutent.pollutantCode = $scope.itemsConfidentiality[i].pollutantCode+".Confidential";
		        			polutent.pollutantGroupCode = $scope.itemsConfidentiality[i].pollutantGroupCode+".Confidential";
		        			polutent.aircount = $scope.itemsConfidentiality[i].confidentialCodeAir ? 1: 0;
		        			polutent.watercount = $scope.itemsConfidentiality[i].confidentialCodeWater ? 1: 0;
		        			polutent.soilcount = $scope.itemsConfidentiality[i].confidentialCodeSoil ? 1: 0;
		        			$scope.itemCon.push(polutent);
		        		}else
		        		{
		        			if( $scope.itemsConfidentiality[i].confidentialCodeAir)
		        			{
		        				conObj.aircount += 1;
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeWater)
		        			{
		        				conObj.watercount += 1;
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeSoil)
		        			{
		        				conObj.soilcount += 1;
		        			}
		        		}
		        	}
		        	// Reason
		        	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) {
		        		if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "polrelease")
		        		{
		        			continue;
		        		}
		        		var conObj =_.find($scope.itemConReason, function(element){ 
		        			return ((element.reason === $scope.itemsConfidentiality[i].confidentialCodeAir) && $scope.itemsConfidentiality[i].confidentialCodeAir) ||
		        			((element.reason === $scope.itemsConfidentiality[i].confidentialCodeWater) && $scope.itemsConfidentiality[i].confidentialCodeWater) ||
		        			((element.reason === $scope.itemsConfidentiality[i].confidentialCodeSoil) && $scope.itemsConfidentiality[i].confidentialCodeSoil)});       		
		        		if(!conObj)
		        		{
		        			var polutent = {};
		        			if( $scope.itemsConfidentiality[i].confidentialCodeAir)
		        			{
		        				polutent.reason = $scope.itemsConfidentiality[i].confidentialCodeAir
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeWater)
		        			{
		        				polutent.reason = $scope.itemsConfidentiality[i].confidentialCodeWater
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeSoil)
		        			{
		        				polutent.reason = $scope.itemsConfidentiality[i].confidentialCodeSoil
		        			}
		        			polutent.pollutantGroupCode = $scope.itemsConfidentiality[i].pollutantGroupCode+".Confidential";
		        			polutent.aircount = $scope.itemsConfidentiality[i].confidentialCodeAir ? 1: 0;
		        			polutent.watercount = $scope.itemsConfidentiality[i].confidentialCodeWater ? 1: 0;
		        			polutent.soilcount = $scope.itemsConfidentiality[i].confidentialCodeSoil ? 1: 0;
		        			$scope.itemConReason.push(polutent);
		        		}else
		        		{
		        			if( $scope.itemsConfidentiality[i].confidentialCodeAir)
		        			{
		        				conObj.aircount += 1;
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeWater)
		        			{
		        				conObj.watercount += 1;
		        			}
		        			if( $scope.itemsConfidentiality[i].confidentialCodeSoil)
		        			{
		        				conObj.soilcount += 1;
		        			} 
		        		}
		        	}
		        	break;
	        	case "polTransfer":
	        		for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) { 		
	        			if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "poltransfer")
		        		{
		        			continue;
		        		}
	        			var conObj =_.find($scope.itemCon, function(element){ return element.pollutantCode === ($scope.itemsConfidentiality[i].pollutantCode + ".Confidential") });       		
	            		if(!conObj)
	            		{
	            			var polutent = {};
	            			polutent.pollutantGroupCode = $scope.itemsConfidentiality[i].pollutantGroupCode+".Confidential";
	            			polutent.pollutantCode = $scope.itemsConfidentiality[i].pollutantCode+".Confidential";
	            			polutent.count = $scope.itemsConfidentiality[i].confidentialCode ? 1: 0;
	        				$scope.itemCon.push(polutent);
	            		}else
	            		{
	            			if( $scope.itemsConfidentiality[i].confidentialCode)
	            			{
	            				conObj.count += 1;
	            			}
	            		}
	            	}
	            	// Reason
	            	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) {
	            		if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "poltransfer")
		        		{
		        			continue;
		        		}
	            		var conObj =_.find($scope.itemConReason, function(element){ 
	            			return ((element.reason === $scope.itemsConfidentiality[i].confidentialCode) && $scope.itemsConfidentiality[i].confidentialCode)});       		
	            		if(!conObj)
	            		{
	            			var polutent = {};
	            			if( $scope.itemsConfidentiality[i].confidentialCode)
	            			{
	            				polutent.reason = $scope.itemsConfidentiality[i].confidentialCode
	            			}
	            			polutent.pollutantGroupCode = $scope.itemsConfidentiality[i].pollutantGroupCode+".Confidential";
	            			polutent.count = $scope.itemsConfidentiality[i].confidentialCode ? 1: 0;
	            			$scope.itemConReason.push(polutent);
	            		}else
	            		{
	            			if( $scope.itemsConfidentiality[i].confidentialCode)
	            			{
	            				conObj.count += 1;
	            			}
	            		}
	            	}	
	        		break;
	        	case "wasteTransfer":
	        		for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) { 		
	        			if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "wastetransfer")
		        		{
		        			continue;
		        		}
	        			if($scope.itemCon.length === 0)
	        			{
	        				var polutent = {};
	        				polutent.countNONHW = 0;
	        				polutent.countHWIC = 0;
	        				polutent.countHWOC = 0;
	        				$scope.itemCon.push(polutent);
	        			}
	        			if($scope.itemsConfidentiality[i].wastetype ==="NONHW")
	        			{
	        				$scope.itemCon[0].countNONHW +=1;
	        			}
	        			if($scope.itemsConfidentiality[i].wastetype ==="HWIC")
	        			{
	        				$scope.itemCon[0].countHWIC +=1;
	        			}
	        			if($scope.itemsConfidentiality[i].wastetype ==="HWOC")
	        			{
	        				$scope.itemCon[0].countHWOC +=1;
	        			}
	            	}
	            	// Reason
	            	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) {
	            		if(!$scope.itemsConfidentiality[i].conftype || $scope.itemsConfidentiality[i].conftype.toLowerCase() != "wastetransfer")
		        		{
		        			continue;
		        		}
	            		
	            		var conObj =_.find($scope.itemConReason, function(element){ 
	            			return ((element.reason === $scope.itemsConfidentiality[i].confidentialCode) && element.wastetype === $scope.itemsConfidentiality[i].wastetype)});       		
	            		if(!conObj)
	            		{
	            			var polutent = {};
	            			polutent.wastetype = $scope.itemsConfidentiality[i].wastetype;
	            			polutent.reason = $scope.itemsConfidentiality[i].confidentialCode
	            			polutent.count = 1;
	            			$scope.itemConReason.push(polutent);
	            		}else
	            		{
	            				conObj.count += 1;
	            		}
	            	}	
	        		break;
	        	default:
	        		break;
        	}	
        };
        
        $scope.updatePollutantReleaseData = function()
        {
        	//$scope.pollutantreleaseItems = angular.copy($scope.items);
        };
        
        $scope.updatePollutantTransferData = function()
        {
        	//$scope.pollutanttransferItems = angular.copy($scope.items);
        };
        
        $scope.updateSummaryData = function() {
         	// $scope.summaryItems = angular.copy($scope.items);
         	  
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
     			$scope.summaryItems[i].wt = $scope.summaryItems[i].wastetype.replace('-','');
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
          
          /*
           * See count factory
           * 
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
          $scope.getFacilityCount = function(elements){  
              
            	if(!elements.length)
            	{
            		elements = jQuery.makeArray(elements);
            	}  
                var total = 0;
                for(var i = 0; i < elements.length; i++){
                    	total += elements[i].facilityTotalCount;
                 
                }
                return total;
            };
          
          
          
          $scope.getTotalCount = function(elements){  
              
            	if(!elements.length)
            	{
            		elements = jQuery.makeArray(elements);
            	}  
                var total = 0;
                for(var i = 0; i < elements.length; i++){
                	if(!elements[i].sublevel)
                	{ 
                		continue;
                	}
                	for(var j = 0; j < elements[i].sublevel.length; j++){
                		total += elements[i].sublevel[j].facilityCount;
                	}
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
          };*/
          
          /**
           * TimeSeries Modal popup
           */
          $scope.openPTSmodal = function (contentype, pollutantId) {
          	/*Convert item into Query params*/
          	var qp = {};
  		    for(var key in $scope.queryParams) {
  		        if(key != 'lov_PollutantID') {
  		        	qp[key] = $scope.queryParams[key];
  		        }
  		    }
          	
          	if(pollutantId !== null)
          		{qp.LOV_PollutantID = pollutantId;}
   
          	var modalInstance = $modal.open({
                templateUrl: 'components/timeseries/tsmodal.html',
                controller: 'ModalTimeSeriesCtrl',
//                size: size,
                resolve: {
              	  isoContType: function () {
              		  return contentype;
              	  },
                 	  isoQP: function () {
              		  return qp;
              	  }
           
                }
              });
          };

          //openWTTSmodal(level2.wastetype)         
          $scope.openWTTSmodal = function (wastetype) {
            	var ct = 'wastetransfer';
            	/*Convert item into Query params*/
            	var qp = {};
    		    for(var key in $scope.queryParams) {
    		        if(key != 'wastetype') {
    		        	qp[key] = $scope.queryParams[key];
    		        }
    		    }
            	
            	if(wastetype !== null)
            		{qp.WasteTypeCode = wastetype;}
     
            	var modalInstance = $modal.open({
                  templateUrl: 'components/timeseries/tsmodal.html',
                  controller: 'ModalTimeSeriesCtrl',
//                  size: size,
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