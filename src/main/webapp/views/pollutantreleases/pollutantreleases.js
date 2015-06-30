'use strict';

angular.module('myApp.pollutantreleases', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize','angularSpinner'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutantreleases', {
            templateUrl: 'views/pollutantreleases/pollutantreleases.html',
            controller: 'PollutantReleasesCtrl'
        });
    }])

    .controller('PollutantReleasesCtrl', ['$scope', '$filter', '$modal', 'searchFilter', 'Restangular',
                                          'translationService','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter, $modal, 
                                        		  searchFilter, Restangular,translationService,formatStrFactory, countFactory, usSpinnerService) {
        $scope.beforesearch = true;
    	$scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
    	$scope.pollutantPanel = true;
        $scope.showReleasesToInputField = true;
        $scope.pollutantPanelTitle = 'Pollutant releases';
        $scope.searchFilter = searchFilter;
        $scope.mediumFilter = {};
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
          
          $scope.stopSpinPart = function(part){
          	$scope.reqStatus[part] = 1;
          	var done = 0;
            angular.forEach($scope.reqStatus, function(value, key) {
                if (value === 0) {
                    done ++;
                }
            });
            if(done < 1){
            	$scope.stopSpin();
            }
          }

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
    	 * Listeners
    	 */
    	
        $scope.$watch('mediumFilter.prSumMedium', function(newvalue,oldvalue){
        	if($scope.mediumFilter.prSumMedium && $scope.items){
        		$scope.updateSummaryData();
        	}
        });

        $scope.$watch('mediumFilter.prAreaMedium', function(newvalue,oldvalue){
        	if($scope.mediumFilter.prAreaMedium && $scope.items){
        		$scope.updateAreaComparisonData();
        	}
        });

        $scope.$watch('mediumFilter.prFacMedium', function(newvalue,oldvalue){
        	if($scope.mediumFilter.prFacMedium && $scope.items){
        		$scope.updateFacilitiesData();
        	}
        });

        $scope.search = function() {
            $scope.beforesearch = false;
        	$scope.reqStatus = {'sum':0,'act':0,'are':0,'aco':0,'fac':0,'con':0 };
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.performSearch();
        };

        $scope.performSearch = function() {
            var rest = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
            $scope.regionSearch = false;
            var pollutantreleaseSearch = rest.all('pollutantreleaseSearch');
            //var mapFilter = 'FacilityReportID IN (select FacilityReportID from dbo.POLLUTANTRELEASE where ';
            	
            var queryParams = {ReportingYear: $scope.currentSearchFilter.selectedReportingYear.year};
            //mapFilter += '(((ReportingYear= ' +  $scope.currentSearchFilter.selectedReportingYear.year + ') ';
            
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.countryId) {
                queryParams.LOV_CountryID = $scope.currentSearchFilter.selectedReportingCountry.countryId;
                //mapFilter += 'And (LOV_CountryID= ' + $scope.currentSearchFilter.selectedReportingCountry.countryId + ') ';
                if ($scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID) {
                    queryParams.LOV_NUTSRegionID = $scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID;
                    //mapFilter += 'And (LOV_NUTSRegionID= ' + $scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID + ') ';
                }
                else if ($scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID) {
                    queryParams.LOV_RiverBasinDistrictID = $scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID;
                    //mapFilter += 'And (LOV_RiverBasinDistrictID= ' + $scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID + ') ';
                }
            }
            if(searchFilter.regionType == 0)
            {
            	//Filter by NUTS regions
            	$scope.regionSearch = true;
            }else
            {
            	//Filter by River Basin District
            	$scope.regionSearch = false;
            }
            
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
                queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
                //mapFilter += 'And (LOV_AreaGroupID= ' + $scope.currentSearchFilter.selectedReportingCountry.groupId + ') ';
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
       
            pollutantreleaseSearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;

                $scope.quantityAir = response.headers('X-QuantityAir');
                $scope.quantityWater = response.headers('X-QuantityWater');
                $scope.quantitySoil = response.headers('X-QuantitySoil');

                $scope.mediumFilter.prSumMedium = 'AIR';
                $scope.mediumFilter.prFacMedium = 'AIR';
                $scope.mediumFilter.prAreaMedium = 'AIR';

                $scope.updateSummaryData();
                $scope.updateFacilitiesData();
                $scope.updateAreaComparisonData();
                
                $scope.updateActivitiesData();
                $scope.updateAreasData();
                
                
            });
            
            // Do confidential search
            pollutantreleaseSearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });
            //$scope.setMapQuery();
            
        };

       
        
        $scope.updateSummaryData = function() {
        	//This filter filters summaryitems?
        	var qmstr = $scope.getQuantityStr($scope.mediumFilter.prSumMedium);
        	$scope.summaryItems = [];
            $scope.summaryItems = $filter('filter')($scope.items, function (item) {
                if (item[qmstr]) {
                    //return true;
                	return {qmstr:item[qmstr], iaactivityCode : $scope.tr_laa[item['iaactivityCode']]};
                }
                return false;
            });

            //Reset graph data
            var graphData = {};
            for (var i = 0; i < $scope.summaryItems.length; i++) {
                if (!graphData[$scope.summaryItems[i].iaactivityCode]) {
                    		graphData[$scope.summaryItems[i].iaactivityCode] = {c: [
                    		    {v: $scope.tr_laa[$scope.summaryItems[i].iaactivityCode]},
                    		    {v: $scope.summaryItems[i][qmstr]}
                    ]};
                } else {
                    graphData[$scope.summaryItems[i].iaactivityCode].c[1].v =
                        graphData[$scope.summaryItems[i].iaactivityCode].c[1].v + $scope.summaryItems[i][qmstr];
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
            $scope.summaryChart.type = 'PieChart';
            $scope.summaryChart.options = {height:heigh, width:'100%',
              		"chartArea": {left:'5%',top:'5%',width:'90%'}};
            $scope.stopSpinPart('sum');
        };

        $scope.updateFacilitiesData = function() {
            $scope.facilitiesItems = $filter('filter')($scope.items, function (item) {
            	if (item[$scope.getQuantityStr($scope.mediumFilter.prFacMedium)]) {
                    return true;
                }
                return false;
            });
            $scope.stopSpinPart('fac');
        };

        $scope.updateAreaComparisonData = function() {
        	var qmstr = $scope.getQuantityStr($scope.mediumFilter.prAreaMedium);//'quantity' + $scope.prAreaMedium;
        	$scope.areaComparisonItems = $filter('filter')($scope.items, function (item) {
                if (item[ $scope.getQuantityStr($scope.mediumFilter.prAreaMedium)]) {
                    return true;
                }
                return false;
            });
            
        	var gr = ($scope.regionSearch)?'n':'r';
        	var group = ($scope.regionSearch)?'nutslevel2RegionCode':'riverBasinDistrictCode';
        	
        	if ($scope.queryParams.LOV_AreaGroupID){
        		gr = 'c';
        		group = 'countryCode';
        	}

        	//nutslevel2RegionCode
        	//riverBasinDistrictCode
        	
            var totalquantity = 0;
            var graphData = {};
            for (var i = 0; i < $scope.areaComparisonItems.length; i++) {
            	var gkey = $scope.areaComparisonItems[i][group];
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
                // Test for creating country
            	if (!graphData[gkey]) {
            		
            		//$scope.tr_chart.AREA
                    graphData[gkey] = 
                    {c: [
                        {v: gkey},
                        {v: $scope.areaComparisonItems[i][qmstr]},
                        {v: "ff<br/>Dette er en test"} 
                    ]};
                    totalquantity +=$scope.areaComparisonItems[i][qmstr];
                } else {
                    graphData[gkey].c[1].v =
                        graphData[gkey].c[1].v + $scope.areaComparisonItems[i][qmstr];
                    graphData[gkey].c[2].v = "ff<br /> test";
                    totalquantity +=$scope.areaComparisonItems[i][qmstr];
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
            $scope.areaComparisonChart.options = {
            		"tooltip": {"isHtml": false}, 
            		"height": heigh, 
            		"legend": {"position": 'none'},
            		"hAxis": {format: '#\'%\''},
            		"chartArea": {"left":200}
            		};
            $scope.areaComparisonChart.type = 'BarChart';
            //$scope.areaComparisonChartObject.draw();
            $scope.stopSpinPart('aco');
        };
        
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = [];
        	$scope.groupbyActivitet('iasectorCode','iaactivityCode','iasubActivityCode',$scope.activities);
        	$scope.stopSpinPart('act');
        };
        
 
        $scope.updateAreasData = function()
        {
        	$scope.areas = [];
        	$scope.groupbyAreas('countryCode',$scope.areas);
        	$scope.stopSpinPart('are');
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
        	$scope.stopSpinPart('con');
        };

        $scope.quantity = function(item) {
        	var qm = $scope.getQuantityStr($scope.mediumType);
            if (item[qm])
            {
                return $scope.ff.formatMethod(item[qm]);
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
                return $scope.ff.formatMethod(item['quantityAccidental' + $scope.mediumType]);
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
        	if (item['quantityAccidental' + $scope.mediumType]){
        		
        		return $scope.ff.DeterminePercent(item['quantity' + $scope.mediumType],item['quantityAccidental' + $scope.mediumType]);
        	}
            else
            {
                return "-";
            }
        };
        
        
        $scope.groupbyActivitet = function(propertyGP1,propertyGP2,propertyGP3, collection)
        {
        	var subCollection = [];
        	for ( var i = 0; i < $scope.items.length; i++ ) {
        		var record = angular.copy($scope.items[i]);
        		var group = $scope.cf.findGroup(collection,record[propertyGP1]);		
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
        	//$scope.cf.getSubSum($scope.activities,"facilityCount",true);
        	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"fcount",false);
        	$scope.totalactivitiesacc = $scope.cf.getSubSum($scope.activities,"facount",false);
        	$scope.totalactivitiessumair = $scope.cf.getSubSum($scope.activities,"quantityAir",true);
        	$scope.totalactivitiessumaair = $scope.cf.getSubSum($scope.activities,"quantityAccidentalAir",true);
        	$scope.totalactivitiessumwater = $scope.cf.getSubSum($scope.activities,"quantityWater",true);
        	$scope.totalactivitiessumawater = $scope.cf.getSubSum($scope.activities,"quantityAccidentalWater",true);
        	$scope.totalactivitiessumsoal = $scope.cf.getSubSum($scope.activities,"quantitySoil",true);
        	$scope.totalactivitiessumasoil = $scope.cf.getSubSum($scope.activities,"quantityAccidentalSoil",true);
        	
        };
        
        $scope.groupbyAreas = function(propertyGP1, collection)
        {
        	for ( var i = 0; i < $scope.items.length; i++ ) {
        		var record = angular.copy($scope.items[i]);
        		var group = $scope.cf.findGroup(collection,record[propertyGP1]);		
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
        	$scope.totalareasfac = $scope.cf.getSubSum($scope.areas,"fcount",false);
        	$scope.totalareasacc = $scope.cf.getSubSum($scope.areas,"facount",false);
        	$scope.totalareassumair = $scope.cf.getSubSum($scope.areas,"quantityAir",true);
        	$scope.totalareassumaair = $scope.cf.getSubSum($scope.areas,"quantityAccidentalAir",true);
        	$scope.totalareassumwater = $scope.cf.getSubSum($scope.areas,"quantityWater",true);
        	$scope.totalareassumawater = $scope.cf.getSubSum($scope.areas,"quantityAccidentalWater",true);
        	$scope.totalareassumsoal = $scope.cf.getSubSum($scope.areas,"quantitySoil",true);
        	$scope.totalareassumasoil = $scope.cf.getSubSum($scope.areas,"quantityAccidentalSoil",true);
        };
        
        /**
         * Extra
         */
        $scope.getQuantityStr = function(medium){
	    	switch(medium){
				case 'AIR':
					$scope.mediumType = 'Air';
					return 'quantityAir';
					break;
				case 'WATER':
					$scope.mediumType = 'Water';
					return 'quantityWater';
					break;
				case 'SOIL':
					$scope.mediumType = 'Soil';
					return 'quantitySoil';
					break;
				default:
					$scope.mediumType = 'Air';
					return 'quantityAir';
					break;
			}
    	}
        
        /**
         * TimeSeries Modal popup
         */
        $scope.openActTSmodal = function (lov_IASectorID, lov_IAActivityID, lov_IASubActivityID) {
        	var ct = 'pollutantrelease';
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
        	var ct = 'pollutantrelease';
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
                
    }])
;