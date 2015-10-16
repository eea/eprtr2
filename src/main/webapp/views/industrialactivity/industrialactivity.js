'use strict';

angular.module('myApp.industrialactivity', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize','angularSpinner','myApp.eprtrgooglechart', 'anguFixedHeaderTable'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/industrialactivity', {
            templateUrl: 'views/industrialactivity/industrialactivity.html',
            controller: 'IndustrialActivityCtrl'
        });
    }])

    .controller('IndustrialActivityCtrl', ['$scope', '$filter', '$modal','searchFilter', 'Restangular','eprtrcms'
                                           ,'formatStrFactory', 'countFactory','usSpinnerService', '$timeout',  
                                           function($scope, $filter, $modal, searchFilter, Restangular,eprtrcms,
                                        		   formatStrFactory,countFactory,usSpinnerService, $timeout) {
        $scope.beforesearch = true;
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
        $scope.quantityTotalSearchResult = 0;
        $scope.cf = countFactory;
        $scope.resize_icon = "fa fa-arrow-left"
        $scope.bigmap = false;
        $scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
       	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
       	$scope.mapctrl = {};
    	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -230)+'px';

        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

//		Requesting text and title resources 
		eprtrcms.get('Facility',null).then(function (data) {
			$scope.tr_f = data;
		});
		eprtrcms.get('Common',null).then(function (data) {
			$scope.tr_c = data;
			$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
		});
		eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
			$scope.tr_lco = data;
		});
		eprtrcms.get('Confidentiality',null).then(function (data) {
			$scope.tr_con = data;
		});
		eprtrcms.get('LOV_NUTSREGION',null).then(function (data) {
			$scope.tr_lnr = data;
		});
		eprtrcms.get('LOV_RIVERBASINDISTRICT',null).then(function (data) {
			$scope.tr_lrbd = data;
		});
		eprtrcms.get('Pollutant',null).then(function (data) {
			$scope.tr_p = data;
		});
		eprtrcms.get('LOV_ANNEXIACTIVITY',null).then(function (data) {
			$scope.tr_laa = data;
		});
		eprtrcms.get('LOV_CONFIDENTIALITY',null).then(function (data) {
			$scope.tr_lcon = data;
		});
		eprtrcms.get('LOV_POLLUTANT',null).then(function (data) {
			$scope.tr_lpo = data;
		});
		eprtrcms.get('LOV_RIVERBASINDISTRICT',null).then(function (data) {
			$scope.tr_lrbd = data;
		});
		eprtrcms.get('WasteTransfers',null).then(function (data) {
			$scope.tr_wt = data;
		});
		eprtrcms.get('IndustrialActivity',null).then(function (data) {
			$scope.tr_ina = data;
		});
		eprtrcms.get('LOV_WASTETYPE',null).then(function (data) {
			$scope.tr_lovwt = data;
		});
        
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
           * MAp handling
           */
          $scope.togglemapview = function(){
          	if($scope.bigmap){
              	$scope.bigmap = false;
              	$scope.resize_icon = "fa fa-arrow-left"
              	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
              	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
              	$scope.maptooltip = "Expand map area"; 
            	$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];

          	}
          	else{
              	$scope.bigmap = true;
              	$scope.resize_icon = "fa fa-arrow-right"
              	$scope.mapclss = "col-md-12 minor-padding";
              	$scope.resclss = "col-md-12 minor-padding";
              	$scope.maptooltip = "Reduce map area";
            	$scope.maptooltip = $scope.tr_c['ShowReducedMap'];
          	}
          	$scope.mapctrl.redraw();
          }
          
          $scope.$watch('mapctrl', function(value) {
              if(typeof $scope.mapctrl.redraw == 'function'){
              	$scope.mapctrl.redraw();
              }
          });

          /**
         * Tab handling
         * */
                
        $scope.active = {
    		fddetails: true
    	};
        $scope.activateTab = function(tab) {
        	$scope.active = {}; //reset
        	$scope.active[tab] = true;
          /*
          $timeout(function() {
            var tmp =$scope.pollutanttransferItems;
            $scope.pollutanttransferItems = 0;
            $scope.pollutanttransferItems = tmp;
          }, 0);
          */
          $scope.getTabData(tab);
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
            $scope.beforesearch = false;
        	$scope.reqStatus = {'pr':0,'pt':0,'wt':0,'co':0 };
    		$scope.startSpin();
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
            $scope.quantityTotalSearchResult = 0;
        	$scope.showConfidential = 'polRelease';
            $scope.getTabData("pollutantrelease");
            $scope.getTabData("pollutanttransfer");
            $scope.getTabData("wastetransfer");
            $scope.getTabData("confidentiality");
            
            $scope.getTotalInSearch();
                      
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
    					//$scope.quantityTotalSearchResult += parseInt($scope.polreleasecount);
    					$scope.updatePollutantReleaseData();
    					break;
    				case "POLLUTANTTRANSFERSUM":
    					$scope.pollutanttransferItems = response.data;
    					$scope.poltransfercount = response.headers('facilitiesCount');
    					//$scope.quantityTotalSearchResult += parseInt($scope.poltransfercount);
    					$scope.updatePollutantTransferData();
    					break;
                  	case "SUMMARY":
                  		$scope.summaryItems = response.data;
                  		$scope.wastetransfercount = response.headers('facilitiesCount');
                  		//$scope.quantityTotalSearchResult += parseInt($scope.wastetransfercount);
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
        
        $scope.getTotalInSearch = function(){
        	
        	var facilityService = $scope.restconfig.one('facilityCount');
        	facilityService.get($scope.queryParams).then(function(response) {
        		$scope.quantityTotalSearchResult = response.data.facilityCount;
        	});
        }
        
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
        	$scope.stopSpinPart('co');
        };
        
        $scope.downloadClick = function(tab){
        	$scope.startSpin();
        	
        	var date = new Date();
        	var dateString = '_'+ date.getFullYear() +'_'+date.getMonth()+'_'+date.getDate();

        	var contentArray = new Array();
        	var fileName = '';
        	if(tab === 'pollutantRelease'){
        		$scope.updatePollutantReleaseDownloadData();
        		contentArray = $scope.pollutantReleaseDownload;
        		fileName = 'EPRTR_Industrial_Activity_Pollutant_Release'+dateString+'.csv';
        	}else if(tab ==='pollutantTransfer'){
        		$scope.updatePollutantTransferDownloadData();
        		contentArray = $scope.pollutantTransferDownload;
        		fileName = 'EPRTR_Industrial_Activity_Pollutant_Transfer'+dateString+'.csv';
        	}else if(tab === 'wasteTransfer'){
        		$scope.updateWasteTransferDownloadData();
        		contentArray = $scope.wasteTransferDownload;
        		fileName = 'EPRTR_Industrial_Activity_Waste_Transfer'+dateString+'.csv';
        	}

        	var csvContent = 'data:text/csv;charset=utf-8,';
        	contentArray.forEach(function(infoArray, index){

        		var dataString = infoArray.join(';').split();
        		csvContent += dataString + "\n";
//        		csvContent.replace(';',',');
        	});
        	
        	var encodedUri = encodeURI(csvContent);
//        	encodedUri.replace(';',',');
    		var link = document.createElement("a");
    		link.setAttribute("href", encodedUri);
    		link.setAttribute("download", fileName);

    		link.click(); // This will download the data file named "my_data.csv".

    		$scope.stopSpin();
        }
        
        $scope.topInfoDownload = function(array){
        	array[1]= new Array();
            array[1][0] = $scope.tr_c.Year;
        	array[1][1] = $scope.queryParams.ReportingYear;
        	
        	array[2]= new Array();
            array[2][0] = $scope.tr_c.Area;
        	array[2][1] = $scope.currentSearchFilter.selectedReportingCountry.name;
        	
        	array[3]= new Array();
            array[3][0] = $scope.tr_ina.Headline;
        	array[3][1] = $scope.sectorIA;
        	
        	array[5]= new Array();
            array[5][0] = $scope.tr_c.TotalInSearch;
        	array[5][1] = $scope.quantityTotalSearchResult;
        	
        	array[6]= new Array();
            array[6][0] = ' ';
        }
        
        $scope.updatePollutantReleaseData = function()
        {
        	//$scope.pollutantreleaseItems = angular.copy($scope.items);
        	$scope.stopSpinPart('pr');
        };
        
        $scope.updatePollutantReleaseDownloadData = function() {
        	$scope.pollutantReleaseDownload= new Array();
            var add_fields = 7;
            
            $scope.topInfoDownload($scope.pollutantReleaseDownload);
            
            $scope.pollutantReleaseDownload[4]= new Array();
            $scope.pollutantReleaseDownload[4][0] = $scope.tr_c.Facilities;
            $scope.pollutantReleaseDownload[4][1] = $scope.polreleasecount;
            
            $scope.pollutantReleaseDownload[add_fields]= new Array();
            $scope.pollutantReleaseDownload[add_fields][0] = $scope.tr_p.ReleasesPerCountry;
        	$scope.pollutantReleaseDownload[add_fields][1] = $scope.tr_c.Facilities;
        	$scope.pollutantReleaseDownload[add_fields][2] = $scope.tr_c.Facilities + '('+$scope.tr_p.ReleasesAccidentalValue+')';
        	$scope.pollutantReleaseDownload[add_fields][3] = $scope.tr_c.Air;
        	$scope.pollutantReleaseDownload[add_fields][4] = $scope.tr_c.Air + '('+$scope.tr_p.ReleasesAccidentalValue+')';
        	$scope.pollutantReleaseDownload[add_fields][5] = $scope.tr_c.Water;
        	$scope.pollutantReleaseDownload[add_fields][6] = $scope.tr_c.Water + '('+$scope.tr_p.ReleasesAccidentalValue+')';
        	$scope.pollutantReleaseDownload[add_fields][7] = $scope.tr_c.Soil;
        	$scope.pollutantReleaseDownload[add_fields][8] = $scope.tr_c.Soil + '('+$scope.tr_p.ReleasesAccidentalValue+')';

        	add_fields += 1;
        	
        	var prs = $scope.pollutantreleaseItems.sort(function(a, b) {
        	    return $scope.tr_lpo[a.key].localeCompare($scope.tr_lpo[b.key]);
        	});
        	
            for(var i =0; i<prs.length;i++){
            	var subPrs = 0;
            	var pr = prs[i];
            	$scope.pollutantReleaseDownload[i+add_fields]= new Array();
            	$scope.pollutantReleaseDownload[i+add_fields][0] = $scope.tr_lpo[pr.key];
            	$scope.pollutantReleaseDownload[i+add_fields][1] = $scope.cf.getFacilityCount(pr.sublevel);
            	
            	pr.sublevel.sort(function(a, b) {
            		return a.pollutantCode.localeCompare(b.pollutantCode);
            	});
            	
            	if(pr.hasOwnProperty('sublevel')){
                	for(var j =0; j<pr.sublevel.length;j++){
                		var subPr = pr.sublevel[j];
                		
                		$scope.pollutantReleaseDownload[i+add_fields+(++subPrs)]= new Array();
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][0] = subPr.pollutantCode;
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][1] = $scope.cf.getTypeCount(subPr);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][2] = $scope.cf.getTypeCountAccidential(subPr);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][3] = $scope.cf.getformat(subPr.quantityAir);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][4] = $scope.cf.getformat(subPr.quantityAccidentalAir);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][5] = $scope.cf.getformat(subPr.quantityWater);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][6] = $scope.cf.getformat(subPr.quantityAccidentalWater);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][7] = $scope.cf.getformat(subPr.quantitySoil);
                    	$scope.pollutantReleaseDownload[i+add_fields+subPrs][8] = $scope.cf.getformat(subPr.quantityAccidentalSoil);
                	}
            	}
            	
            	$scope.pollutantReleaseDownload[i+add_fields+(++subPrs)]= new Array();
            	$scope.pollutantReleaseDownload[i+add_fields+subPrs][0] = ' ';
            	add_fields += ++subPrs;
            }
        }
        
        $scope.updatePollutantTransferData = function()
        {
        	//$scope.pollutanttransferItems = angular.copy($scope.items);
        	$scope.stopSpinPart('pt');
        };
        
        $scope.updatePollutantTransferDownloadData = function() {
        	$scope.pollutantTransferDownload= new Array();
            var add_fields = 7;
            
            $scope.topInfoDownload($scope.pollutantTransferDownload);
            
            $scope.pollutantTransferDownload[4]= new Array();
            $scope.pollutantTransferDownload[4][0] = $scope.tr_c.Facilities;
            $scope.pollutantTransferDownload[4][1] = $scope.poltransfercount;
            
            $scope.pollutantTransferDownload[add_fields]= new Array();
            $scope.pollutantTransferDownload[add_fields][0] = $scope.tr_p.TransferPerCountry;
        	$scope.pollutantTransferDownload[add_fields][1] = $scope.tr_c.Facilities;
        	$scope.pollutantTransferDownload[add_fields][2] = $scope.tr_c.Quantity;

        	add_fields += 1;
        	
        	var pts = $scope.pollutanttransferItems.sort(function(a, b) {
        	    return $scope.tr_lpo[a.key].localeCompare($scope.tr_lpo[b.key]);
        	});
        	
            for(var i =0; i<pts.length;i++){
            	var subpts = 0;
            	var pt = pts[i];
            	$scope.pollutantTransferDownload[i+add_fields]= new Array();
            	$scope.pollutantTransferDownload[i+add_fields][0] = $scope.tr_lpo[pt.key];
            	$scope.pollutantTransferDownload[i+add_fields][1] = $scope.cf.getFacilityCount(pt.sublevel);
            	
            	pt.sublevel.sort(function(a, b) {
            		return a.pollutantCode.localeCompare(b.pollutantCode);
            	});
            	
            	if(pt.hasOwnProperty('sublevel')){
                	for(var j =0; j<pt.sublevel.length;j++){
                		var subPt = pt.sublevel[j];
                		
                		$scope.pollutantTransferDownload[i+add_fields+(++subpts)]= new Array();
                    	$scope.pollutantTransferDownload[i+add_fields+subpts][0] = subPt.pollutantCode;
                    	$scope.pollutantTransferDownload[i+add_fields+subpts][1] = $scope.cf.getTypeCount(subPt);
                    	$scope.pollutantTransferDownload[i+add_fields+subpts][2] = $scope.cf.getformat(subPt.totalQuantity);
                	}
            	}
            	$scope.pollutantTransferDownload[i+add_fields+(++subpts)]= new Array();
            	$scope.pollutantTransferDownload[i+add_fields+subpts][0] = ' ';
            	
            	add_fields += subpts+1;
            }
        }
        
        $scope.updateSummaryData = function() {
         	// $scope.summaryItems = angular.copy($scope.items);
         	  
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
     			$scope.summaryItems[i].wt = $scope.summaryItems[i].wastetype.replace('-','');
         		$scope.summaryItems[i].wastetype = $scope.tr_lovwt[$scope.summaryItems[i].wastetype];
            }
         	  // Create grafs
         	  var graphData = {};
         	  var graphData2 = {};
         	  
            for (var i = 0; i < $scope.summaryItems.length; i++) {
                // Create graph data
          	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["NONHW"]) {
                    graphData[$scope.tr_wt["Recovery"]] = {c: [
                        {v: $scope.tr_wt["Recovery"]},
                        {v: Math.round($scope.summaryItems[i].rpct * 100) / 100}]};
                    graphData[$scope.tr_wt["Disposal"]] = {c: [
                       {v: $scope.tr_wt["Disposal"]},
                       {v: Math.round($scope.summaryItems[i].dpct * 100) / 100}]};
                    graphData[$scope.tr_wt["Unspecified"]] = {c: [
                       {v:$scope.tr_wt["Unspecified"]},
                       {v: Math.round($scope.summaryItems[i].upct * 100) / 100}]};
                }
          	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["HWIC"]) {
          		  graphData2[$scope.tr_wt["RecoveryDomestic"]] = {c: [
                       {v: $scope.tr_wt["RecoveryDomestic"]},
                       {v: Math.round($scope.summaryItems[i].quantityRecovery * 100) / 100}]};
          		  graphData2[$scope.tr_wt["DisposalDomestic"]] = {c: [
                      {v: $scope.tr_wt["DisposalDomestic"]},
                      {v: Math.round($scope.summaryItems[i].quantityDisposal * 100) / 100}]};
          		  graphData2[$scope.tr_wt["UnspecifiedDomestic"]] = {c: [
                          {v: $scope.tr_wt["UnspecifiedDomestic"]},
                          {v: Math.round($scope.summaryItems[i].quantityUnspec * 100) / 100}]};
          	  }
          	  if ($scope.summaryItems[i].wastetype === $scope.tr_lovwt["HWOC"]) {
          		  graphData2[$scope.tr_wt["RecoveryTransboundary"]] = {c: [
                           {v: $scope.tr_wt["RecoveryTransboundary"]},
                           {v: Math.round($scope.summaryItems[i].quantityRecovery * 100) / 100}]};
          		  graphData2[$scope.tr_wt["DisposalTransboundary"]] = {c: [
                      {v: $scope.tr_wt["DisposalTransboundary"]},
                      {v: Math.round($scope.summaryItems[i].quantityDisposal * 100) / 100}]};
          		  graphData2[$scope.tr_wt["UnspecifiedTransboundary"]] = {c: [
                      {v: $scope.tr_wt["UnspecifiedTransboundary"]},
                      {v: Math.round($scope.summaryItems[i].quantityUnspec * 100) / 100}]};
          	  }          
            }

       
            var graphDataArray2 = [];
            for (var key in graphData2) {
                if (graphData2.hasOwnProperty(key)) {
                    graphDataArray2 = graphDataArray2.concat(graphData2[key]);
                }
            }

            $scope.summaryChart2 = {};
            $scope.summaryChart2.data = {
                    "cols": [
                        {id: "t", label: "Name", type: "string"},
                        {id: "s", label: "Total", type: "number"}
                    ],
                    "rows": graphDataArray2
                };
            $scope.summaryChart2.options = {"title":$scope.tr_c["HazardousWwaste"],"sliceVisibilityThreshold": 0,"height": 300};
            $scope.summaryChart2.type = 'PieChart';
            
            var graphDataArray = [];
            for (var key in graphData) {
                if (graphData.hasOwnProperty(key)) {
                    graphDataArray = graphDataArray.concat(graphData[key]);
                }
            }
            $scope.summaryChart1 = {};
            $scope.summaryChart1.data = {
                "cols": [
                    {id: "t", label: "Name", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ],
                "rows": graphDataArray
            };
            $scope.summaryChart1.options = {"title":$scope.tr_wt["Nonhazardouswaste"],"sliceVisibilityThreshold": 0,"height": 300};
            //$scope.summaryChartObject1.type = 'PieChart';
            $scope.summaryChart1.type = 'PieChart';
            
        	$scope.stopSpinPart('wt');
          };
          
          $scope.updateWasteTransferDownloadData = function() {
          	$scope.wasteTransferDownload= new Array();
              var add_fields = 7;
              
              $scope.topInfoDownload($scope.wasteTransferDownload);
              
              $scope.wasteTransferDownload[4]= new Array();
              $scope.wasteTransferDownload[4][0] = $scope.tr_c.Facilities;
              $scope.wasteTransferDownload[4][1] = $scope.wastetransfercount;
              
              $scope.wasteTransferDownload[add_fields]= new Array();
              $scope.wasteTransferDownload[add_fields][0] = $scope.tr_wt.WasteTransfers;
          	$scope.wasteTransferDownload[add_fields][1] = $scope.tr_c.Facilities;
          	$scope.wasteTransferDownload[add_fields][2] = $scope.tr_wt.Recovery;
          	$scope.wasteTransferDownload[add_fields][3] = $scope.tr_wt.Recovery + '(%)';
          	$scope.wasteTransferDownload[add_fields][4] = $scope.tr_wt.Disposal;
          	$scope.wasteTransferDownload[add_fields][5] = $scope.tr_wt.Disposal + '(%)';
          	$scope.wasteTransferDownload[add_fields][6] = $scope.tr_wt.Unspecified;
          	$scope.wasteTransferDownload[add_fields][7] = $scope.tr_wt.Unspecified + '(%)';
          	$scope.wasteTransferDownload[add_fields][8] = $scope.tr_c.TotalQuantity;
          	
          	var wts = $scope.summaryItems.sort(function(a, b) {
          	    return a.wastetype.localeCompare(b.wastetype);
          	});
          	
              for(var i =0; i<wts.length;i++){
              	var subWts = 0;
              	var wt = wts[i];
              	$scope.wasteTransferDownload[i+(++add_fields)]= new Array();
              	$scope.wasteTransferDownload[i+add_fields][0] = wt.wastetype;
              	$scope.wasteTransferDownload[i+add_fields][1] = wt.facilityCount;
              	$scope.wasteTransferDownload[i+add_fields][2] = $scope.cf.getformat(wt.quantityRecovery);
              	$scope.wasteTransferDownload[i+add_fields][3] = $scope.cf.getpctformat(wt.rpct);
              	$scope.wasteTransferDownload[i+add_fields][4] = $scope.cf.getformat(wt.quantityDisposal);
              	$scope.wasteTransferDownload[i+add_fields][5] = $scope.cf.getpctformat(wt.dpct);
              	$scope.wasteTransferDownload[i+add_fields][6] = $scope.cf.getformat(wt.quantityUnspec);
              	$scope.wasteTransferDownload[i+add_fields][7] = $scope.cf.getpctformat(wt.upct);
              	$scope.wasteTransferDownload[i+add_fields][8] = $scope.cf.getformat(wt.quantityTotal);
              	
              }
          }
          
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