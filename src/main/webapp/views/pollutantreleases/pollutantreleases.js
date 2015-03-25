'use strict';

angular.module('myApp.pollutantreleases', ['ngRoute', 'googlechart', 'myApp.search-filter', 'restangular'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutantreleases', {
            templateUrl: 'views/pollutantreleases/pollutantreleases.html',
            controller: 'PollutantReleasesCtrl'
        });
    }])

    .controller('PollutantReleasesCtrl', ['$scope', '$filter', 'searchFilter', 'Restangular','translationService', function($scope, $filter, searchFilter, Restangular,translationService) {
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
                $scope.updateSummaryData();
                $scope.updateFacilitiesData();
                $scope.updateAreaComparisonData();
                
                $scope.updateActivitiesData();
                $scope.updateAreasData();
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
        	// Releases per industrial activity Facilities Air Water Soil
        };
        
        
        
        $scope.showinfo = function(data, ref)
        {
        
        	alert('test');
        };
        
        /*Two levels*/
        $scope.updateAreasData = function()
        {
        	$scope.contries = [];
        	$scope.groupby('countryCode',false); //,'facilityID');
        	
        	translationService.get().then(function (data) {
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
        		$scope.tr_p = data.Pollutant;
        		
        		/*$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_w = data.WasteTransfers;
        		$scope.tr_lna = data.LOV_NACEACTIVITY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_lu = data.LOV_UNIT;
        		$scope.tr_lcf = data.LOV_CONFIDENTIALITY;
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lmbn = data.LOV_METHODBASIS;
        		$scope.tr_lmtn = data.LOV_METHODTYPE;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lwt = data.LOV_WASTETREATMENT;
        		$scope.tr_lme = data.LOV_MEDIUM;
        		$scope.tr_lib = data.Library;*/
            });
        	
        	$scope.areasItems = $filter('filter')($scope.items, function (item) {
        		return true; // Return all for now
        	});
        	// $scope.items
        	// alert('Grid Area data');
        	// gridAreas
        	// Translate
        	/*
        	nutslevel2RegionCode  region
        	riverBasinDistrictCode
        	*/	
        	// countryCode
        	// $scope.gridAreasOptions.data = $scope.items;
        };
        
        $scope.updateConfidentialityData = function()
        {
        	// Pia chart
        	//alert('Grid Confidentiality Data');
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
        
     
  
        
        $scope.getSum = function(item, type)
        {
        	if(!item.length)
        	{
        		item = jQuery.makeArray(item);
        	}
        	var sum = 0;
    		for(var i = 0; i < item.length; i++)
			{
				 var temp = item[i][type];
				 if(temp)
				 {
					 sum += temp;
				 }
			}
    		if(sum == 0)
    		{
    			return "-";
    		}
    		// TODO format
    		return sum;
     
        };
        
        $scope.getTypeCount = function(item, type){  
            
        	if(!item.length)
        	{
        		item = jQuery.makeArray(item);
        	}
            
            var total = 0;
            for(var i = 0; i < item.length; i++){
                if(type=="facility")
                {
                	total += item[i].fcount;
                }else
                {
                	total += item[i].facount;
                }
            }
            return total;
        }
        
        $scope.groupby = function(propertyGP1, propertyGP2)
        {
        	$scope.contries = [];
        	var gval = "_nogruopvalue_";
        	for ( var i = 0; i < $scope.items.length; i++ ) {
        		var record = $scope.items[i];
        	
        		if(record[propertyGP1] !== gval)
        		{
        			var group = {
    					key: record[propertyGP1],
    					data:[]
        			};
        			gval = group.key;
        			$scope.contries.push(group);
        		}
        		var exist = false;
        		
        		for(var j = 0;j< group.data.length; j++)
        		{
        			if(group.data[j].riverBasinDistrictCode == record.riverBasinDistrictCode)
        			{
        				// Groupe
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
        		//group.data.push(record);
        	}
        	
        	
        	if(!propertyGP2)
        	{
        		return;
        	}
        	
        	for(var i = 0; i<$scope.contries.length;i++)
        	{
        		var gval2 = "_nogruopvalue_";
        		// Get groupe1
        		var levelGP2 = $scope.contries[i];
        		for(var j = 0; j < levelGP2.data.length; j++)
        		{
        			var record = levelGP2.data[j];
        			if(record[propertyGP2] !== gval2)
        			{
        				var group2 = {
        						key: record[propertyGP2],
        						data2:[]
        				};
        				gval2 = group2.key; 
        				$scope.contries[i].data.push(group2);
        			}
        			group2.data2.push(record);
        		}
        	}
        	
        };
        
    }])
;