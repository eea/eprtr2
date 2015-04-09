'use strict';

angular.module('myApp.pollutantreleases', ['ngRoute', 'googlechart', 'myApp.search-filter', 'restangular','ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutantreleases', {
            templateUrl: 'views/pollutantreleases/pollutantreleases.html',
            controller: 'PollutantReleasesCtrl'
        });
    }])

    .controller('PollutantReleasesCtrl', ['$scope', '$filter', 'searchFilter', 'Restangular','translationService','formatStrFactory', function($scope, $filter, searchFilter, Restangular,translationService,formatStrFactory) {
        $scope.pollutantPanel = true;
        $scope.showReleasesToInputField = true;
        $scope.pollutantPanelTitle = 'Pollutant releases';
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
        		$scope.tr_chart = data.ChartLabels;
        	  });
        };
        
        $scope.translate();
        $scope.$watch('mediumTypeSummary', function(value) {
            if ($scope.items) {
                $scope.updateSummaryData();
            }
        });

        $scope.$watch('mediumTypeFacilities', function(value) {
            if ($scope.items) {
                $scope.updateFacilitiesData();
            }
        });

        $scope.$watch('mediumTypeAreaComparison', function(value) {
            if ($scope.items) {
                $scope.updateAreaComparisonData();
            }
        });

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
            var facilitySearch = rest.all('pollutantreleaseSearch');
            	
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
            if(searchFilter.regionType == 0)
            {
            	$scope.regionSearch = true;
            }else
            {
            	$scope.regionSearch = false;
            }
            
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
                queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
            }
            if ($scope.currentSearchFilter.activitySearchFilter) {
                $scope.currentSearchFilter.activitySearchFilter.filter(queryParams);
            }
            if ($scope.currentSearchFilter.pollutantSearchFilter) {
                $scope.currentSearchFilter.pollutantSearchFilter.filter(queryParams);
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
       
            facilitySearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;

                $scope.quantityAir = response.headers('X-QuantityAir');
                $scope.quantityWater = response.headers('X-QuantityWater');
                $scope.quantitySoil = response.headers('X-QuantitySoil');

                $scope.mediumTypeSummary = 'Air';
                $scope.mediumTypeFacilities = 'Air';
                $scope.mediumTypeAreaComparison = 'Air';
                

                $scope.updateSummaryData();
                $scope.updateFacilitiesData();
                $scope.updateAreaComparisonData();
                
                $scope.updateActivitiesData();
                $scope.updateAreasData();
                
                
            });
            
            // Do confidential search
            facilitySearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });
        };

        $scope.updateSummaryData = function() {
            $scope.summaryItems = $filter('filter')($scope.items, function (item) {
                if (item['quantity' + $scope.mediumTypeSummary]) {
                    return true;
                }
                return false;
            });
     	
            for(var i = 0; i <$scope.summaryItems.length;i++)
            {
            	$scope.summaryItems[i].iaactivityCode = $scope.tr_laa[$scope.summaryItems[i].iaactivityCode];
            }

            var graphData = {};
            for (var i = 0; i < $scope.summaryItems.length; i++) {
                if (!graphData[$scope.summaryItems[i].iaactivityCode]) {
                    graphData[$scope.summaryItems[i].iaactivityCode] = {c: [
                        {v: $scope.summaryItems[i].iaactivityCode},
                        {v: $scope.summaryItems[i]['quantity' + $scope.mediumTypeSummary]}
                    ]};
                } else {
                    graphData[$scope.summaryItems[i].iaactivityCode].c[1].v =
                        graphData[$scope.summaryItems[i].iaactivityCode].c[1].v + $scope.summaryItems[i]['quantity' + $scope.mediumTypeSummary];
                }
            }

            var graphDataArray = [];
            for (var key in graphData) {
                if (graphData.hasOwnProperty(key)) {
                    graphDataArray = graphDataArray.concat(graphData[key]);
                }
            }

            $scope.summaryChartObject = {};
            $scope.summaryChartObject.data = {
                "cols": [
                    {id: "t", label: "Name", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ],
                "rows": graphDataArray
            };
            $scope.summaryChartObject.type = 'PieChart';
        };

        $scope.updateFacilitiesData = function() {
            $scope.facilitiesItems = $filter('filter')($scope.items, function (item) {
                if (item['quantity' + $scope.mediumTypeFacilities]) {
                    return true;
                }
                return false;
            });
        };

        $scope.updateAreaComparisonData = function() {
            $scope.areaComparisonItems = $filter('filter')($scope.items, function (item) {
                if (item['quantity' + $scope.mediumTypeAreaComparison]) {
                    return true;
                }
                return false;
            });
            
            var totalquantity = 0;
            var graphData = {};
            for (var i = 0; i < $scope.areaComparisonItems.length; i++) {
                // Test for creating country
            	if (!graphData[$scope.areaComparisonItems[i].countryCode]) {
            		
            		//$scope.tr_chart.AREA
                    graphData[$scope.areaComparisonItems[i].countryCode] = 
                    {c: [
                        {v: $scope.areaComparisonItems[i].countryCode},
                        {v: $scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary]},
                        {v: "ff<br/>Dette er en test"} 
                    ]};
                    totalquantity +=$scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary];
                } else {
                    graphData[$scope.areaComparisonItems[i].countryCode].c[1].v =
                        graphData[$scope.areaComparisonItems[i].countryCode].c[1].v + $scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary];
                    graphData[$scope.areaComparisonItems[i].countryCode].c[2].v = "ff<br /> test";
                    totalquantity +=$scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary];
                }
            }

            var graphDataArray = [];
            for (var key in graphData) {
                if (graphData.hasOwnProperty(key)) {
                	// Calculate % of total quantity
                	graphData[key].c[1].v =  Math.round(((graphData[key].c[1].v * 100) / totalquantity)*100)/100;
                    graphDataArray = graphDataArray.concat(graphData[key]);
                }
            }
        	
            // $scope.tr_chart.PERCENT_TOTAL;
            $scope.areaComparisonChartObject = {};
            $scope.areaComparisonChartObject.data = {
                "cols": [
                    {id: "t", label: "Name", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ],
                "rows": graphDataArray
            };
            $scope.areaComparisonChartObject.options = {"tooltip": {"isHtml": false}};
            $scope.areaComparisonChartObject.type = 'BarChart';
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
        	$scope.hasConfidentionalData = $scope.itemsConfidentiality.length > 0? true: false;
        	
        	$scope.itemCon = [];
        	$scope.itemConReason = [];
        	// Confidential
        	for ( var i = 0; i < $scope.itemsConfidentiality.length; i++ ) { 		
        		var conObj =_.find($scope.itemCon, function(element){ return element.pollutantCode === ($scope.itemsConfidentiality[i].pollutantCode + ".Confidential") });       		
        		if(!conObj)
        		{
        			var polutent = {};
        			polutent.pollutantCode = $scope.itemsConfidentiality[i].pollutantCode+".Confidential";
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
        
        $scope.formatNumber = function(value)
        {
        	return value 
        };
        
        

        $scope.quantity = function(item) {
            if (item['quantity' + $scope.mediumType])
            {
                return item['quantity' + $scope.mediumType];
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

        $scope.quantityAccidental = function(item) {
            if (item['quantityAccidental' + $scope.mediumType])
            {
                return item['quantityAccidental' + $scope.mediumType];
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

        $scope.percentageAccidental = function(item) {
            if (item['percentageAccidental' + $scope.mediumType])
            {
                return item['percentageAccidental' + $scope.mediumType];
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
        				if(record.quantityAir)
        				{
        					group.data[j].quantityAir += record.quantityAir;
        				}
        				if(record.quantitySoil)
        				{
        					group.data[j].quantitySoil += record.quantitySoil;	
        				}
        				if(record.quantityWater)
        				{
        					group.data[j].quantityWater += record.quantityWater;
        				}
        				var accidentalfound = false;
        				if(record.quantityAccidentalAir)
        				{
        					group.data[j].quantityAccidentalAir += record.quantityAccidentalAir;
        					accidentalfound = true;
        				}
        				if(record.quantityAccidentalSoil)
        				{
        					group.data[j].quantityAccidentalSoil += record.quantityAccidentalSoil;
        					accidentalfound = true;
        				}
        				if(record.quantityAccidentalWater)
        				{
        					group.data[j].quantityAccidentalWater += record.quantityAccidentalWater;
        					accidentalfound = true;
        				}
        				group.data[j].fcount+=1;
        				if(accidentalfound)
        				{
        					group.data[j].facount+=1;
        				}
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
        			if(record.quantityAccidentalAir || record.quantityAccidentalSoil || record.quantityAccidentalWater)
        			{
        				record.facount = 1;
        			}else
        			{
        				record.facount = 0;
        			}
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
        		        				if(subCollection[i].quantityAir)
        		        				{
        		        					sublevel[m].quantityAir += subCollection[i].quantityAir;
        		        				}
        		        				if(subCollection[i].quantitySoil)
        		        				{
        		        					sublevel[m].quantitySoil += subCollection[i].quantitySoil;	
        		        				}
        		        				if(subCollection[i].quantityWater)
        		        				{
        		        					sublevel[m].quantityWater += subCollection[i].quantityWater;
        		        				}
        		        				var accidentalfound = false;
        		        				if(subCollection[i].quantityAccidentalAir)
        		        				{
        		        					sublevel[m].quantityAccidentalAir += subCollection[i].quantityAccidentalAir;
        		        					accidentalfound = true;
        		        				}
        		        				if(subCollection[i].quantityAccidentalSoil)
        		        				{
        		        					sublevel[m].quantityAccidentalSoil += subCollection[i].quantityAccidentalSoil;
        		        					accidentalfound = true;
        		        				}
        		        				if(subCollection[i].quantityAccidentalWater)
        		        				{
        		        					sublevel[m].quantityAccidentalWater += subCollection[i].quantityAccidentalWater;
        		        					accidentalfound = true;
        		        				}
        		        				sublevel[m].fcount+=1;
        		        				if(accidentalfound)
        		        				{
        		        					sublevel[m].facount+=1;
        		        				}
        		        				existSublevel = true;
        		        				break;
        		        			}
        		        		} // end for
        		        		
        		        		if(!existSublevel)
        		        		{	
        		        			subCollection[i].fcount = 1;
        		        			if(subCollection[i].quantityAccidentalAir || subCollection[i].quantityAccidentalSoil || subCollection[i].quantityAccidentalWater)
        		        			{
        		        				subCollection[i].facount = 1;
        		        			}else
        		        			{
        		        				subCollection[i].facount = 0;
        		        			}
        		        			sublevel.push(subCollection[i]);
        		        		}        		
        					}
        				}
        			}
        		} // End collection
        	}
        	
        	$scope.totalactivitiesfac = $scope.getTotalCount("activities","fcount");
        	$scope.totalactivitiesacc = $scope.getTotalCount("activities","facount");
        	$scope.totalactivitiessumair = $scope.getSumTotal("activities","quantityAir");
        	$scope.totalactivitiessumaair = $scope.getSumTotal("activities","quantityAccidentalAir");
        	$scope.totalactivitiessumwater = $scope.getSumTotal("activities","quantityWater");
        	$scope.totalactivitiessumawater = $scope.getSumTotal("activities","quantityAccidentalWater");
        	$scope.totalactivitiessumsoal = $scope.getSumTotal("activities","quantitySoil");
        	$scope.totalactivitiessumasoil = $scope.getSumTotal("activities","quantityAccidentalSoil");
        	
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
        				if(record.quantityAir)
        				{
        					group.data[j].quantityAir += record.quantityAir;
        				}
        				if(record.quantitySoil)
        				{
        					group.data[j].quantitySoil += record.quantitySoil;	
        				}
        				if(record.quantityWater)
        				{
        					group.data[j].quantityWater += record.quantityWater;
        				}
        				var accidentalfound = false;
        				if(record.quantityAccidentalAir)
        				{
        					group.data[j].quantityAccidentalAir += record.quantityAccidentalAir;
        					accidentalfound = true;
        				}
        				if(record.quantityAccidentalSoil)
        				{
        					group.data[j].quantityAccidentalSoil += record.quantityAccidentalSoil;
        					accidentalfound = true;
        				}
        				if(record.quantityAccidentalWater)
        				{
        					group.data[j].quantityAccidentalWater += record.quantityAccidentalWater;
        					accidentalfound = true;
        				}
        				group.data[j].fcount+=1;
        				if(accidentalfound)
        				{
        					group.data[j].facount+=1;
        				}
        				exist = true;
        				break;
        			}
        		}
        		if(!exist)
        		{
        			record.fcount = 1;
        			if(record.quantityAccidentalAir || record.quantityAccidentalSoil || record.quantityAccidentalWater)
        			{
        				record.facount = 1;
        			}else
        			{
        				record.facount = 0;
        			}
        			group.data.push(record);
        		}        		
        	}
        	$scope.totalareasfac = $scope.getTotalCount("areas","fcount");
        	$scope.totalareasacc = $scope.getTotalCount("areas","facount");
        	$scope.totalareassumair = $scope.getSumTotal("areas","quantityAir");
        	$scope.totalareassumaair = $scope.getSumTotal("areas","quantityAccidentalAir");
        	$scope.totalareassumwater = $scope.getSumTotal("areas","quantityWater");
        	$scope.totalareassumawater = $scope.getSumTotal("areas","quantityAccidentalWater");
        	$scope.totalareassumsoal = $scope.getSumTotal("areas","quantitySoil");
        	$scope.totalareassumasoil = $scope.getSumTotal("areas","quantityAccidentalSoil");
        };
  
        $scope.showinfo = function(data, ref)
        {
        	alert('test');
        };
    }])
;