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

            facilitySearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;

                $scope.quantityAir = response.headers('X-QuantityAir');
                $scope.quantityWater = response.headers('X-QuantityWater');
                $scope.quantitySoil = response.headers('X-QuantitySoil');

                $scope.mediumTypeSummary = 'Air';
                $scope.mediumTypeFacilities = 'Air';
                $scope.mediumTypeAreaComparison = 'Air';
                
                $scope.translate();
                $scope.updateSummaryData();
                $scope.updateFacilitiesData();
                $scope.updateAreaComparisonData();
                
                $scope.updateActivitiesData();
                $scope.updateAreasData();
                $scope.updateConfidentialityData();
                
            });
            var test = "";
        };

        $scope.updateSummaryData = function() {
            $scope.summaryItems = $filter('filter')($scope.items, function (item) {
                if (item['quantity' + $scope.mediumTypeSummary]) {
                    return true;
                }
                return false;
            });

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

            var graphData = {};
            for (var i = 0; i < $scope.areaComparisonItems.length; i++) {
                if (!graphData[$scope.areaComparisonItems[i].countryCode]) {
                    graphData[$scope.areaComparisonItems[i].countryCode] = {c: [
                        {v: $scope.areaComparisonItems[i].countryCode},
                        {v: $scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary]}
                    ]};
                } else {
                    graphData[$scope.areaComparisonItems[i].countryCode].c[1].v =
                        graphData[$scope.areaComparisonItems[i].countryCode].c[1].v + $scope.areaComparisonItems[i]['quantity' + $scope.mediumTypeSummary];
                }
            }

            var graphDataArray = [];
            for (var key in graphData) {
                if (graphData.hasOwnProperty(key)) {
                    graphDataArray = graphDataArray.concat(graphData[key]);
                }
            }

            $scope.areaComparisonChartObject = {};
            $scope.areaComparisonChartObject.data = {
                "cols": [
                    {id: "t", label: "Name", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ],
                "rows": graphDataArray
            };
            $scope.areaComparisonChartObject.type = 'BarChart';
        };
        
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = [];
        	$scope.groupbyActivitet('iasectorCode','iaactivityCode','iasubActivityCode',$scope.activities);
        };
        
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
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        	  });
        };
        
        $scope.updateAreasData = function()
        {
        	$scope.areas = [];
        	$scope.groupbyAreas('countryCode',$scope.areas);
        };
        
        $scope.updateConfidentialityData = function()
        {
    		// Area
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
        }
        
        

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
        }
        
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
    				subCollection.push(record);
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
        		//console.log("sub: "+subCollection[i][propertyGP3]);
        		for(var j = 0; j < collection.length;j++)
        		{
        			if(collection[j].key === subCollection[i].iasectorCode)
        			{
        				for(var n = 0;n < collection[j].data.length;n++)
        				{
        					// iaactivityCode
        					if(collection[j].data[n].iaactivityCode === subCollection[i].iaactivityCode)
        					{
        						var sublevel = collection[j].data[n].sublevel;       						
        						if(!sublevel){
        							sublevel = [];
        							collection[j].data[n].sublevel = sublevel;
        							collection[j].data[n].sublevel.push(subCollection[i]);					
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
        		        				if(sublevel[m][propertyGP3] === '4.(a).(i)')
            		        			{
            		        				//console.log("4.(A).(I): "+sublevel[m].fcount + " "+sublevel[m].facount);
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
        		        			//console.log("CR: "+subCollection[i][propertyGP3]);
        		        			if(subCollection[i][propertyGP3] === '4.(a).(i)')
        		        			{
        		        				//console.log("CREATE 4.(A).(I): "+subCollection[i].fcount + " "+subCollection[i].facount);
        		        			}
        		        			
        		        			sublevel.push(subCollection[i]);
        		        		}        		
        					}
        				}
        			}
        		} // End collection
        	}    	
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
        };
  
        $scope.showinfo = function(data, ref)
        {
        	alert('test');
        };
    }])
;