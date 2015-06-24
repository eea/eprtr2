'use strict';

angular.module('myApp.pollutanttransfers', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutanttransfers', {
            templateUrl: 'views/pollutanttransfers/pollutanttransfers.html',
            controller: 'PollutantTransfersCtrl'
        });
    }])

    .controller('PollutantTransfersCtrl', ['$scope','$filter', '$modal', '$rootScope','searchFilter', 'Restangular','translationService',
                                           'formatStrFactory', function($scope, $filter, $modal, $rootScope, searchFilter, Restangular,
                                        		   translationService,formatStrFactory) {
        $scope.pollutantPanel = true;
        $scope.pollutantPanelTitle = 'Pollutant transfers';
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
    	  });
        
        /*
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
        
        $scope.search = function() {
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.performSearch();
        };
        
        $scope.performSearch = function() {
            var rest = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
            $scope.regionSearch = false;
            
            var pollutanttransferSearch = rest.all('pollutanttransferSearch');
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
            if ($scope.currentSearchFilter.pollutantSearchFilter) {
                $scope.currentSearchFilter.pollutantSearchFilter.filterTransfer(queryParams);
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
            if($scope.confidentialParams.LOV_PollutantID)
            {
            	delete $scope.confidentialParams.LOV_PollutantID;
            }
            if ($scope.currentSearchFilter.pollutantSearchFilter) {
            	$scope.confidentialParams.LOV_PollutantGroupID = $scope.currentSearchFilter.pollutantSearchFilter.selectedPollutantGroup.lov_PollutantID;
            }
            $scope.confidentialParams.ConfidentialIndicator = 1;
       
            pollutanttransferSearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;
              
                $scope.updateSummaryData();
                $scope.updateAreaComparisonData();
                $scope.updateActivitiesData();
                $scope.updateAreasData();
                $scope.updateFacilitiesData();
            });
            
            $scope.isConfidental();
            if ($scope.hasConfidentionalData){
                pollutanttransferSearch.getList($scope.confidentialParams).then(function(response) {
                    $scope.itemsConfidentiality = response.data;
                    $scope.updateConfidentialityData();
                });
            }
            
        };
        
  
       
        $scope.updateSummaryData = function() {
        	 $scope.summaryItems = angular.copy($scope.items);
        	
        	for(var i = 0; i <$scope.summaryItems.length;i++)
			{
        		 $scope.summaryItems[i].iaactivityCode = $scope.tr_laa[$scope.summaryItems[i].iaactivityCode];
			}
        	  
        	var graphData = {};
              for (var i = 0; i < $scope.summaryItems.length; i++) {
                  if (!graphData[$scope.summaryItems[i].iaactivityCode]) {
                      graphData[$scope.summaryItems[i].iaactivityCode] = {c: [
                          {v: $scope.summaryItems[i].iaactivityCode},
                          {v: $scope.summaryItems[i]['quantity']}
                      ]};
                  } else {
                      graphData[$scope.summaryItems[i].iaactivityCode].c[1].v =
                          graphData[$scope.summaryItems[i].iaactivityCode].c[1].v + $scope.summaryItems[i]['quantity'];
                  }
              }

              var graphDataArray = [];
              for (var key in graphData) {
                  if (graphData.hasOwnProperty(key)) {
                      graphDataArray = graphDataArray.concat(graphData[key]);
                  }
              }

              var heigh = Object.keys(graphData).length * 40;
              heigh = (heigh<400)?400:heigh;
              $scope.summaryChart = {};
              $scope.summaryChart.data = {
                  "cols": [
                      {id: "t", label: "Name", type: "string"},
                      {id: "s", label: "Total", type: "number"}
                  ],
                  "rows": graphDataArray
              };
              $scope.summaryChart.options = {height:heigh, width:'100%',
              		"chartArea": {left:'5%',top:'5%',width:'90%'}};
              $scope.summaryChart.type = 'PieChart';
        	 
        };

    	/**
    	 * Show Confidental indicator 
    	 * */
        $scope.isConfidental = function(){
    		if (_.keys($scope.queryParams).length > 0){
    			var rest = Restangular.withConfig(function(RestangularConfigurer) {
    	            RestangularConfigurer.setFullResponse(true);
    	        });
    			var isconfservice = rest.one('pollutanttransferIsConfidential');
    			isconfservice.get($scope.queryParams).then(function(response) {
    	            $scope.hasConfidentionalData = (response.data === 'true');
    	        });
    		}    	
        };

        
        $scope.updateFacilitiesData = function() {
            $scope.facilitiesItems = angular.copy($scope.items);
        };
        
        $scope.updateAreaComparisonData = function() {
        	 $scope.areaComparisonItems = angular.copy($scope.items);

             var totalquantity = 0;
             var graphData = {};
             
         	var gr = ($scope.regionSearch)?'n':'r';
        	var group = ($scope.regionSearch)?'nutslevel2RegionCode':'riverBasinDistrictCode';
        	
        	if ($scope.queryParams.LOV_AreaGroupID){
        		gr = 'c';
        		group = 'countryCode';
        	}
             
             for (var i = 0; i < $scope.areaComparisonItems.length; i++) {
                 // Test for creating country
            	 var gkey = '$scope.areaComparisonItems[i][group]';
             	switch (gr) {
				case 'n':
					gkey = $scope.tr_lnr[$scope.areaComparisonItems[i][group]];
					break;
				case 'r':
					gkey = $scope.tr_lrbd[$scope.areaComparisonItems[i][group]];
					break;
				case 'c':
					gkey = $scope.tr_lco[$scope.areaComparisonItems[i][group]];
					break;
				default:
					break;
				}

             	if (!graphData[gkey]) {
             		
             		//$scope.tr_chart.AREA
                     graphData[gkey] = 
                     {c: [
                         {v: gkey},
                         {v: $scope.areaComparisonItems[i]['quantity']}

                     ]};
                     totalquantity +=$scope.areaComparisonItems[i]['quantity'];
                 } else {
                     graphData[gkey].c[1].v =
                         graphData[gkey].c[1].v + $scope.areaComparisonItems[i]['quantity'];
                     totalquantity +=$scope.areaComparisonItems[i]['quantity'];
                 }
             }

             var graphDataArray = [];
             var numOfKeys = 0;
             for (var key in graphData) {
                 if (graphData.hasOwnProperty(key)) {
                 	// Calculate % of total quantity
                 	graphData[key].c[1].v =  Math.round(((graphData[key].c[1].v * 100) / totalquantity)*100)/100;
                     graphDataArray = graphDataArray.concat(graphData[key]);
                 }
                 numOfKeys ++;
             }
             
             graphDataArray = _.sortBy(graphDataArray, function(element) {  return element.c[1].v;}).reverse();
         	 var heigh = (numOfKeys*30)+30;

             // $scope.tr_chart.PERCENT_TOTAL;
             $scope.areaComparisonChart = {};
             $scope.areaComparisonChart.data = {
                 "cols": [
                     {id: "t", label: "Name", type: "string"},
                     {id: "s", label: "Total", type: "number"}
                 ],
                 "rows": graphDataArray
             };
             $scope.areaComparisonChart.options= {
         		"tooltip": {"isHtml": false}, 
         		"height": heigh, 
         		"width": '100%', 
         		"legend": {"position": 'none'},
         		"hAxis": {format: '#\'%\''},
         		"chartArea": {"left":200}
         		};
             $scope.areaComparisonChart.type = 'BarChart';
             $rootScope.$emit('resizeMsg');
             //$scope.areaComparisonChart.draw();

        };
        
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = [];
        	$scope.groupbyActivitet('iasectorCode','iaactivityCode','iasubActivityCode',$scope.activities);
        };
        
        $scope.updateAreasData = function()
        {
        	$scope.areas = [];
        	$scope.groupbyAreas('countryCode',$scope.areas);
        };
        
        $scope.updateConfidentialityData = function()
        {
        	//$scope.hasConfidentionalData = $scope.itemsConfidentiality.length > 0? true: false;
        	
        	$scope.itemCon = [];
        	$scope.itemConReason = [];
        	// Confidential
        	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) { 		
        		var conObj =_.find($scope.itemCon, function(element){ return element.pollutantCode === ($scope.itemsConfidentiality[i].pollutantCode + ".Confidential") });       		
        		if(!conObj)
        		{
        			var polutent = {};
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
        		var conObj =_.find($scope.itemConReason, function(element){ 
        			return ((element.reason === $scope.itemsConfidentiality[i].confidentialCode) && $scope.itemsConfidentiality[i].confidentialCode)});       		
        		if(!conObj)
        		{
        			var polutent = {};
        			if( $scope.itemsConfidentiality[i].confidentialCode)
        			{
        				polutent.reason = $scope.itemsConfidentiality[i].confidentialCode
        			}
        			
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
        
        $scope.quantity = function(item) {
            if (item['quantity'])
            {
                return item['quantity'] + ' kg';
            }
            else if (item.confidentialIndicator)
            {
                return "CONFIDENTIAL";
            }
            else
            {
                return "-";
            }
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
        
        $scope.getTypeCount = function(elements, type){  
            
        	if(!elements.length)
        	{
        		elements = jQuery.makeArray(elements);
        	}
            
            var total = 0;
            for(var i = 0; i < elements.length; i++){
                if(type==="facility")
                {
                	total += elements[i].fcount;
                }else
                {
                	total += elements[i].facount;
                }
            }
            return total;
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
        
        $scope.groupbyActivitet = function(propertyGP1,propertyGP2,propertyGP3, collection)
        {
        	var subCollection = [];
        	for ( var i = 0; i < $scope.items.length; i++ ) {
        		var record = angular.copy($scope.items[i]);
        		var group = $scope.findGroup(collection,record[propertyGP1]);		
        		if(!group)
        		{
        			group = {
    					key: record[propertyGP1],
    					data:[]
        			};
        			collection.push(group);
        		}
        		var exist = false;
        		for(var j = 0;j< group.data.length; j++)
        		{
        			if(group.data[j][propertyGP2] === record[propertyGP2])
        			{
        				if(record.quantity)
        				{
        					group.data[j].quantity += record.quantity;
        				}
        				group.data[j].fcount+=1;
        				exist = true;
        				break;
        			}
        		}
        		var levelkey = record[propertyGP3];
    			if(levelkey) 
    			{
    				subCollection.push(angular.copy(record));
    			}else
    			{
    				// Find unspecified sub levels if more then one
    				var result = _.countBy($scope.items, function(element){ return (element[propertyGP2] === record[propertyGP2] && element[propertyGP3])? 'foundcount' : 'notfoundcount'; });
    				if(result.foundcount)
    				{
    					// set unspecified sub levels
    					record.iasubActivityCode = "unspecified";
    					subCollection.push(angular.copy(record));
    				}
    			}
        		if(!exist)
        		{
        			record.fcount = 1;
        			record.facount = 0;
        			group.data.push(record);
        		}        		
        	}

        	// Create level 3
        	for(var i = 0;i<subCollection.length;i++)
        	{
        		for(var j = 0; j < collection.length;j++)
        		{
        			if(collection[j].key === subCollection[i].iasectorCode)
        			{
        				for(var n = 0;n < collection[j].data.length;n++)
        				{
        					if(collection[j].data[n].iaactivityCode === subCollection[i].iaactivityCode)
        					{
        						var sublevel = collection[j].data[n].sublevel;       						
        						if(!sublevel){
        							sublevel = [];
        							collection[j].data[n].sublevel = sublevel;
        						}
        								
        						var existSublevel = false;
        		        		for(var m = 0;m < sublevel.length; m++)
        		        		{
        		        			if(sublevel[m][propertyGP3] === subCollection[i][propertyGP3])
        		        			{
        		        				if(subCollection[i].quantity)
        		        				{
        		        					sublevel[m].quantity += subCollection[i].quantity;
        		        				}
        		        				sublevel[m].fcount+=1;
        		        				existSublevel = true;
        		        				break;
        		        			}
        		        		} // end for
        		        		
        		        		if(!existSublevel)
        		        		{	
        		        			subCollection[i].fcount = 1;
        		        			subCollection[i].facount = 0;
        		        			sublevel.push(subCollection[i]);
        		        		}        		
        					}
        				}
        			}
        		} // End collection
        	}
        	
        	$scope.totalactivitiesfac = $scope.getTotalCount("activities","fcount");
        	$scope.totalactivitiesq = $scope.getSumTotal("activities","quantity");	
        };
        
        $scope.groupbyAreas = function(propertyGP1, collection)
        {
        	for ( var i = 0; i < $scope.items.length; i++ ) {
        		var record = angular.copy($scope.items[i]);
        		var group = $scope.findGroup(collection,record[propertyGP1]);		
        		if(!group)
        		{
        			group = {
    					key: record[propertyGP1],
    					data:[]
        			};
        			collection.push(group);
        		}
        		var exist = false;
        		for(var j = 0;j< group.data.length; j++)
        		{
        			// Test it work with areas
        			if(($scope.regionSearch && group.data[j].nutslevel2RegionCode === record.nutslevel2RegionCode) ||   
        				(!$scope.regionSearch && group.data[j].riverBasinDistrictCode === record.riverBasinDistrictCode))
        			{
        				if(record.quantity)
        				{
        					group.data[j].quantity += record.quantity;
        				}
        				group.data[j].fcount+=1;
        				exist = true;
        				break;
        			}
        		}
        		if(!exist)
        		{
        			record.fcount = 1;
        			record.facount = 0;
        			
    				if($scope.regionSearch){
    					if (record.lov_NUTSRegionID == undefined){
    						if (record.lov_NUTSRLevel3ID != null){
    							record.lov_NUTSRegionID = record.lov_NUTSRLevel3ID;
    						}
    						else if (record.lov_NUTSRLevel2ID != null){
    							record.lov_NUTSRegionID = record.lov_NUTSRLevel2ID;
    						}
    						else if (record.lov_NUTSRLevel1ID != null){
    							record.lov_NUTSRegionID = record.lov_NUTSRLevel1ID;
    						}
    					}
    					if (record.lov_NUTSRegionID == undefined){
    						for ( var j = 1; j < $scope.items.length; j++ ) {
    							if ($scope.items[j].lov_NUTSRegionID != undefined){
    	    						if ($scope.items[j].lov_NUTSRLevel3ID != null){
    	    							record.lov_NUTSRegionID = $scope.items[j].lov_NUTSRLevel3ID;
        								break;
    	    						}
    	    						else if ($scope.items[j].lov_NUTSRLevel2ID != null){
    	    							record.lov_NUTSRegionID = $scope.items[j].lov_NUTSRLevel2ID;
        								break;
    	    						}
    	    						else if ($scope.items[j].lov_NUTSRLevel1ID != null){
    	    							record.lov_NUTSRegionID = $scope.items[j].lov_NUTSRLevel1ID;
        								break;
    	    						}
    							}
    						}
    					}
    					record.riverBasinDistrictCode = null;
    					record.lov_RiverBasinDistrictID = null;
    				}
    				else{
    					if (record.lov_RiverBasinDistrictID == undefined){
    						for ( var j = 1; j < $scope.items.length; j++ ) {
    							if ($scope.items[j].lov_RiverBasinDistrictID != undefined){
    								record.LOV_RiverBasinDistrictID = $scope.items[j].lov_RiverBasinDistrictID;
    								break;
    							}
    						}
    					}
    					record.nutslevel2RegionCode = null;
    					record.lov_NUTSRegionID = null;
    				}

        			group.data.push(record);
        		}        		
        	}
        	$scope.totalareasfac = $scope.getTotalCount("areas","fcount");
        	$scope.totalareasq = $scope.getSumTotal("areas","quantity");
        };
        
        /**
         * TimeSeries Modal popup
         */
        $scope.openActTSmodal = function (lov_IASectorID, lov_IAActivityID, lov_IASubActivityID) {
        	var ct = 'pollutanttransfer';
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
 
        	var modalInstance = $modal.open({
              templateUrl: 'components/timeseries/tsmodal.html',
              controller: 'ModalTimeSeriesCtrl',
//              size: size,
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
        
        $scope.openAreaTSmodal = function (lov_CountryID, lov_NUTSRegionID, lov_RiverBasinDistrictID) {
        	var ct = 'pollutanttransfer';
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
 
        	var modalInstance = $modal.open({
              templateUrl: 'components/timeseries/tsmodal.html',
              controller: 'ModalTimeSeriesCtrl',
//              size: size,
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
    
    }]);