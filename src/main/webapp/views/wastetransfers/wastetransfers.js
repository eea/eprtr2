'use strict';

angular.module('myApp.wastetransfers', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize',
                                        'myApp.wastetransferconfidential','myApp.wasteAreaComparison',
                                        'myApp.hazTransboundary','myApp.HazReceiversWasteTab'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wastetransfers', {
            templateUrl: 'views/wastetransfers/wastetransfers.html',
            controller: 'WasteTransfersCtrl'
        });
    }])

    .controller('WasteTransfersCtrl', ['$scope', '$filter', '$modal', 'searchFilter', 'Restangular',
                                       'eprtrcms','formatStrFactory','countFactory', function($scope, $filter, $modal, 
                                    		   searchFilter, Restangular,eprtrcms,formatStrFactory,countFactory) {

    	$scope.bigmap = false;
    	$scope.mapctrl = {};
    	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -230)+'px';

    	/*    	$scope.mapclss = "col-md-3 col-md-push-6";
    	$scope.resclss = "col-md-6 col-md-pull-3";*/
    	$scope.beforesearch = true;
    	$scope.wastePanel = true;
        $scope.searchFilter = searchFilter;
        $scope.ff = formatStrFactory;
        $scope.cf = countFactory;
        $scope.isConfidential = false;
        $scope.queryParams = {};
        $scope.wtfilter = {};
        $scope.wtfcsel = {};
        $scope.wtconfcoll = [];
        $scope.wtconfreasoncoll = [];
        $scope.queryParams.ReportingYear = -1;
        $scope.SearchType="SUMMARY";
        $scope.hazTransboundaryData = {};
        $scope.resize_icon = "fa fa-arrow-left";
        $scope.header = {};

        $scope.showhazreceivers = false;
		$scope.showareacomparison = false;

        
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
		eprtrcms.get('LOV_WASTETYPE',null).then(function (data) {
			$scope.tr_lovwt = data;
		});
		eprtrcms.get('ChartLabels',null).then(function (data) {
			$scope.tr_chart = data;
		});
		eprtrcms.get('WasteTransfers',null).then(function (data) {
			$scope.tr_wt = data;
		});
        

        /**
         * MAp handling*/
        $scope.togglemapview = function(){
        	if($scope.bigmap){
            	$scope.bigmap = false;
            	$scope.resize_icon = "fa fa-arrow-left";
            	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
            	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
        		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
        	}
        	else{
            	$scope.bigmap = true;
            	$scope.resize_icon = "fa fa-arrow-right";
            	$scope.mapclss = "col-md-12 minor-padding";
            	$scope.resclss = "col-md-12 minor-padding";
        		$scope.maptooltip = $scope.tr_c['ShowReducedMap'];
        	}
        	$scope.mapctrl.redraw();
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
    
    $scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });

	$scope.$watch('currentPage', function(value) {
    	if ($scope.currentSearchFilter !== undefined) {
    		$scope.performSearch();
    	}
    });
    
    $scope.$watch('sort.sortingOrder', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch(true);
    	}
    });
    
    $scope.$watch('sort.reverse', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch();
    	}
    });

    $scope.$watch('wtfcsel.wtsel', function(value) {
//    $scope.wtfcsel = function(wastetype){
    	if($scope.wtfcsel && $scope.wtfcsel.wtsel){
	    	$scope.wtfilter.wtsel =  $scope.wtfcsel.wtsel;
	    	$scope.currentPage = 1;
	    	if ($scope.currentSearchFilter !== undefined) {
	    		//$scope.performSearch();
	    	}
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
        	$scope.beforesearch = false;
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
            	$scope.header.area = $scope.currentSearchFilter.selectedReportingCountry.name;
                if ($scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID) {
                	queryParams.LOV_NUTSRegionID = $scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID;
                	$scope.header.area = $scope.currentSearchFilter.selectedRegion.name;
                }
                else if ($scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID) {
                	queryParams.LOV_RiverBasinDistrictID = $scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID;
                	$scope.header.area = $scope.currentSearchFilter.selectedRegion.name;
                }
            }
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
            	queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
            	$scope.header.area = $scope.currentSearchFilter.selectedReportingCountry.name;
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
            $scope.showhazreceivers = false;
    		$scope.showareacomparison = false;
        
        	if(type.toUpperCase() === "AREACOMPARISON" )
        	{
        		console.log('Set showareacomparison 2 true!');
        		$scope.showareacomparison = true;
        	}
        	if(type.toUpperCase() === "HAZRECEIVERS" )
        	{
                $scope.showhazreceivers = true;
                return;
        	}

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
        	$scope.queryParamsFacilities = jQuery.extend(true,qp);
        	$scope.getData(qp);
        };
        
        $scope.getData = function(qp){
        	$scope.facilitySearch.getList(qp).then(function(response) {
        		$scope.items = response.data;
        		console.dir('xxx');
        		console.dir($scope.queryParams.SearchType.toUpperCase());
                console.dir('xxx');
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
                  	case "HAZTRANSBOUNDARY":
                  		 $scope.updateHaztransboundaryData();
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
       			//formatStrFactory.getStrFormat($scope.summaryItems[i].quantityRecovery);
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

          $scope.summaryChart2 = {};
          $scope.summaryChart2.data = {
                  "cols": [
                      {id: "t", label: "Name", type: "string"},
                      {id: "s", label: "Total", type: "number"}
                  ],
                  "rows": graphDataArray2
              };
          $scope.summaryChart2.options = {"title":$scope.tr_c["HazardousWwaste"],"sliceVisibilityThreshold": 0};
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
          $scope.summaryChart1.options = {"title":$scope.tr_wt["Nonhazardouswaste"],"sliceVisibilityThreshold": 0};
          $scope.summaryChart1.type = 'PieChart';
        };
        
        $scope.performSearchWithoutLimit = function() {
        	var rest = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });
            $scope.regionSearch = false;
            
            $scope.facilitySearchWithoutLimit = rest.all('wastetransferSearch');
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
            	queryParams.order = $scope.sort.sortingOrder;
        		queryParams.desc = $scope.sort.reverse;
        	}


        	// Create confidential search
            $scope.confidentialParams = angular.copy(queryParams);
            $scope.confidentialParams.ConfidentialIndicator = 1;
            
            $scope.getIsConfidential();
            $scope.queryParamsWithoutLimit = queryParams;
                 
            /*facilitySearch.getList($scope.confidentialParams).then(function(response) {
                $scope.itemsConfidentiality = response.data;
                $scope.updateConfidentialityData();
            });*/
            
            $scope.facilitySearchWithoutLimit.getList($scope.queryParamsWithoutLimit).then(function(response) {
    			$scope.facilitiesCompleteItems = response.data;
    			$scope.updateFacilitiesDownloadData();
    			
    			var date = new Date();
            	var contentDate = '_'+date.getFullYear()+'_'+date.getMonth()+'_'+date.getDate();
    			var contentArray = $scope.facilitiesDownload;
            	var fileName = 'EPRTR_Waste_Transfer_Facilities'+contentDate+'.csv';
            	
            	var csvContent = 'data:text/csv;charset=utf-8,';
            	contentArray.forEach(function(infoArray, index){

            		var dataString = infoArray.join(';').split();
            		csvContent += dataString + "\n";
//            		csvContent.replace(';',',');
            	});
            	
            	var encodedUri = encodeURI(csvContent);
//            	encodedUri.replace(';',',');
        		var link = document.createElement("a");
        		link.setAttribute("href", encodedUri);
        		link.setAttribute("download", fileName);

        		link.click(); // This will download the data file named "my_data.csv".
    		});
                      
        };
        
        $scope.downloadClick = function(tab){

        	var contentArray = new Array();
        	var date = new Date();
        	var contentDate = '_'+date.getFullYear()+'_'+date.getMonth()+'_'+date.getDate();
        	var fileName = '';
        	if(tab === 'activities'){
        		$scope.updateActivitiesDownloadData();
        		contentArray = $scope.activitiesDownload;
        		fileName = 'EPRTR_Waste_Transfer_Activities'+contentDate+'.csv';
        	}else if(tab ==='areas'){
        		$scope.updateAreasDownloadData();
        		contentArray = $scope.areasDownload;
        		fileName = 'EPRTR_Waste_Transfer_Areas'+contentDate+'.csv';
        	}else if(tab === 'facilities'){
        		$scope.performSearchWithoutLimit();
        		return;
            		
        	}/*else if(tab === 'transboundary'){
        		$scope.updateTransboundaryDownloadData();
        		contentArray = $scope.transboundaryDownload;
        		fileName = 'EPRTR_Waste_Transfer_Haz_Transboundary'+contentDate+'.csv';
        	}*/

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
        }
        
        $scope.topInfoDownload = function(array){
        	
        	array[1]= new Array();
            array[1][0] = $scope.tr_c.Year;
        	array[1][1] = $scope.queryParams.ReportingYear;
        	
        	array[2]= new Array();
            array[2][0] = $scope.tr_c.Area;
        	array[2][1] = $scope.currentSearchFilter.selectedReportingCountry.name;
        	
        	array[3]= new Array();
            array[3][0] = $scope.tr_c.Facilities;
        	array[3][1] = $scope.cf.getTypeCount($scope.summaryItems);

        	array[4]= new Array();
            array[4][0] = ' ';
        }
        
        /**
         * Activities
         */
        $scope.updateActivitiesData = function()
        {
        	$scope.activities = angular.copy($scope.items);
          	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"facilityCount",false);
        	$scope.totaltHWIC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWIC",true);
        	$scope.totalrHWIC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWIC","unitCodeHWIC");
        	$scope.totaldHWIC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWIC","unitCodeHWIC");
        	$scope.totaluHWIC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWIC","unitCodeHWIC");
        	
        	$scope.totaltHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC","unitCodeHWOC");
        	$scope.totalrHWOC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWOC","unitCodeHWOC");
        	$scope.totaldHWOC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWOC","unitCodeHWOC");
        	$scope.totaluHWOC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWOC","unitCodeHWOC");
        	
        	$scope.totalthaz = $scope.cf.getSubSum($scope.activities,"quantityTotalHW","unitCodeNONHW");
        	$scope.totalrhaz = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHW","unitCodeNONHW");
        	$scope.totaldhaz = $scope.cf.getSubSum($scope.activities,"quantityDisposalHW","unitCodeNONHW");
        	$scope.totaluhaz = $scope.cf.getSubSum($scope.activities,"quantityUnspecHW","unitCodeNONHW");
        	
        	$scope.totaltNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW","unitCodeNONHW");
        	$scope.totalrNONHW = $scope.cf.getSubSum($scope.activities,"quantityRecoveryNONHW","unitCodeNONHW");
        	$scope.totaldNONHW = $scope.cf.getSubSum($scope.activities,"quantityDisposalNONHW","unitCodeNONHW");
        	$scope.totaluNONHW = $scope.cf.getSubSum($scope.activities,"quantityUnspecNONHW","unitCodeNONHW");
        	
        };
        
        $scope.roman = function deromanize (str) {
    		var	str = str.toUpperCase(),
    			validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
    			token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
    			key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
    			num = 0, m;
    		if (!(str && validator.test(str)))
    			return false;
    		while (m = token.exec(str))
    			num += key[m[0]];
    		return num;
    	}
        
        $scope.updateActivitiesDownloadData = function() {
        	$scope.activitiesDownload= new Array();
            var add_fields = 5;
            
            $scope.topInfoDownload($scope.activitiesDownload);
            
            $scope.activitiesDownload[add_fields]= new Array();
            $scope.activitiesDownload[add_fields][0] = $scope.tr_wt.TransferPerIndustrialActivity;
        	$scope.activitiesDownload[add_fields][1] = $scope.tr_c.Facilities;
        	$scope.activitiesDownload[add_fields][2] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Total +')';
        	$scope.activitiesDownload[add_fields][3] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Recovery +')';
        	$scope.activitiesDownload[add_fields][4] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Disposal +')';
        	$scope.activitiesDownload[add_fields][5] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.activitiesDownload[add_fields][6] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Total +')';
        	$scope.activitiesDownload[add_fields][7] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Recovery +')';
        	$scope.activitiesDownload[add_fields][8] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Disposal +')';
        	$scope.activitiesDownload[add_fields][9] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.activitiesDownload[add_fields][10] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Total +')';
        	$scope.activitiesDownload[add_fields][11] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Recovery +')';
        	$scope.activitiesDownload[add_fields][12] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Disposal +')';
        	$scope.activitiesDownload[add_fields][13] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.activitiesDownload[add_fields][14] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Total +')';
        	$scope.activitiesDownload[add_fields][15] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Recovery +')';
        	$scope.activitiesDownload[add_fields][16] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Disposal +')';
        	$scope.activitiesDownload[add_fields][17] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.NonHazardousTotal +')';

        	add_fields += 1;
        	
        	var activities = $scope.activities.sort(function(a, b) {
        	    return a.key - b.key;
        	});
        	
            for(var i =0; i<$scope.activities.length;i++){
            	var subActivities = 0;
            	var activity = activities[i];
            	$scope.activitiesDownload[i+add_fields]= new Array();
            	$scope.activitiesDownload[i+add_fields][0] = $scope.tr_laa[activity.key];
            	$scope.activitiesDownload[i+add_fields][1] = $scope.cf.getTypeCount(activity.data);
            	$scope.activitiesDownload[i+add_fields][2] = $scope.cf.getSum(activity.data,"quantityTotalHWIC","unitCodeHWIC");
            	$scope.activitiesDownload[i+add_fields][3] = $scope.cf.getSum(activity.data,"quantityRecoveryHWIC","unitCodeHWIC");
            	$scope.activitiesDownload[i+add_fields][4] = $scope.cf.getSum(activity.data,"quantityDisposalHWIC","unitCodeHWIC");
            	$scope.activitiesDownload[i+add_fields][5] = $scope.cf.getSum(activity.data,"quantityUnspecHWIC","unitCodeHWIC");
            	$scope.activitiesDownload[i+add_fields][6] = $scope.cf.getSum(activity.data,"quantityTotalHWOC","unitCodeHWOC");
            	$scope.activitiesDownload[i+add_fields][7] = $scope.cf.getSum(activity.data,"quantityRecoveryHWOC","unitCodeHWOC");
            	$scope.activitiesDownload[i+add_fields][8] = $scope.cf.getSum(activity.data,"quantityDisposalHWOC","unitCodeHWOC");
            	$scope.activitiesDownload[i+add_fields][9] = $scope.cf.getSum(activity.data,"quantityUnspecHWOC","unitCodeHWOC");
            	$scope.activitiesDownload[i+add_fields][10] = $scope.cf.getSum(activity.data,"quantityTotalHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][11] = $scope.cf.getSum(activity.data,"quantityRecoveryHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][12] = $scope.cf.getSum(activity.data,"quantityDisposalHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][13] = $scope.cf.getSum(activity.data,"quantityUnspecHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][14] = $scope.cf.getSum(activity.data,"quantityTotalNONHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][15] = $scope.cf.getSum(activity.data,"quantityRecoveryNONHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][16] = $scope.cf.getSum(activity.data,"quantityDisposalNONHW","unitCodeNONHW");
            	$scope.activitiesDownload[i+add_fields][17] = $scope.cf.getSum(activity.data,"quantityUnspecNONHW","unitCodeNONHW");
            	
            	activity.data = activity['data'].sort(function(a, b) {
            	    return a.iaactivityCode - b.iaactivityCode;
            	});
            	
            	for(var j =0; j<activity.data.length;j++){
            		var subActivity = activity.data[j];
            		$scope.activitiesDownload[i+add_fields+(++subActivities)]= new Array();
                	$scope.activitiesDownload[i+add_fields+subActivities][0] = $scope.tr_laa[subActivity.iaActivityCode];
                	$scope.activitiesDownload[i+add_fields+subActivities][1] = $scope.cf.getTypeCount(subActivity);
                	$scope.activitiesDownload[i+add_fields+subActivities][2] = $scope.cf.getSum(subActivity,"quantityTotalHWIC","unitCodeHWIC");
                	$scope.activitiesDownload[i+add_fields+subActivities][3] = $scope.cf.getSum(subActivity,"quantityRecoveryHWIC","unitCodeHWIC");
                	$scope.activitiesDownload[i+add_fields+subActivities][4] = $scope.cf.getSum(subActivity,"quantityDisposalHWIC","unitCodeHWIC");
                	$scope.activitiesDownload[i+add_fields+subActivities][5] = $scope.cf.getSum(subActivity,"quantityUnspecHWIC","unitCodeHWIC");
                	$scope.activitiesDownload[i+add_fields+subActivities][6] = $scope.cf.getSum(subActivity,"quantityTotalHWOC","unitCodeHWOC");
                	$scope.activitiesDownload[i+add_fields+subActivities][7] = $scope.cf.getSum(subActivity,"quantityRecoveryHWOC","unitCodeHWOC");
                	$scope.activitiesDownload[i+add_fields+subActivities][8] = $scope.cf.getSum(subActivity,"quantityDisposalHWOC","unitCodeHWOC");
                	$scope.activitiesDownload[i+add_fields+subActivities][9] = $scope.cf.getSum(subActivity,"quantityUnspecHWOC","unitCodeHWOC");
                	$scope.activitiesDownload[i+add_fields+subActivities][10] = $scope.cf.getSum(subActivity,"quantityTotalHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][11] = $scope.cf.getSum(subActivity,"quantityRecoveryHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][12] = $scope.cf.getSum(subActivity,"quantityDisposalHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][13] = $scope.cf.getSum(subActivity,"quantityUnspecHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][14] = $scope.cf.getSum(subActivity,"quantityTotalNONHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][15] = $scope.cf.getSum(subActivity,"quantityRecoveryNONHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][16] = $scope.cf.getSum(subActivity,"quantityDisposalNONHW","unitCodeNONHW");
                	$scope.activitiesDownload[i+add_fields+subActivities][17] = $scope.cf.getSum(subActivity,"quantityUnspecNONHW","unitCodeNONHW");
                	
                	if(subActivity.hasOwnProperty('sublevel') && subActivity.sublevel instanceof Array && subActivity.sublevel.length >=0){
                		subActivity.sublevel= subActivity.sublevel.sort(function(a, b) {
                			return $scope.roman(a.iaSubActivityCode.substring(7, a.iaSubActivityCode.length-1))- $scope.roman(b.iaSubActivityCode.substring(7, b.iaSubActivityCode.length-1));
                    	});
                		
                		for(var k =0; k< subActivity.sublevel.length ;k++){
                    		var subSubActivity = subActivity.sublevel[k];
                    		$scope.activitiesDownload[i+add_fields+(++subActivities)]= new Array();
                        	$scope.activitiesDownload[i+add_fields+subActivities][0] = $scope.tr_laa[subSubActivity.iaSubActivityCode];
                        	$scope.activitiesDownload[i+add_fields+subActivities][1] = $scope.cf.getTypeCount(subSubActivity);
                        	$scope.activitiesDownload[i+add_fields+subActivities][2] = $scope.cf.getSum(subSubActivity,"quantityTotalHWIC","unitCodeHWIC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][3] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHWIC","unitCodeHWIC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][4] = $scope.cf.getSum(subSubActivity,"quantityDisposalHWIC","unitCodeHWIC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][5] = $scope.cf.getSum(subSubActivity,"quantityUnspecHWIC","unitCodeHWIC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][6] = $scope.cf.getSum(subSubActivity,"quantityTotalHWOC","unitCodeHWOC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][7] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHWOC","unitCodeHWOC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][8] = $scope.cf.getSum(subSubActivity,"quantityDisposalHWOC","unitCodeHWOC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][9] = $scope.cf.getSum(subSubActivity,"quantityUnspecHWOC","unitCodeHWOC");
                        	$scope.activitiesDownload[i+add_fields+subActivities][10] = $scope.cf.getSum(subSubActivity,"quantityTotalHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][11] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][12] = $scope.cf.getSum(subSubActivity,"quantityDisposalHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][13] = $scope.cf.getSum(subSubActivity,"quantityUnspecHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][14] = $scope.cf.getSum(subSubActivity,"quantityTotalNONHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][15] = $scope.cf.getSum(subSubActivity,"quantityRecoveryNONHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][16] = $scope.cf.getSum(subSubActivity,"quantityDisposalNONHW","unitCodeNONHW");
                        	$scope.activitiesDownload[i+add_fields+subActivities][17] = $scope.cf.getSum(subSubActivity,"quantityUnspecNONHW","unitCodeNONHW");
                    	}
                	}
                	
            	}
            	$scope.activitiesDownload[i+add_fields+(++subActivities)]= new Array();
            	$scope.activitiesDownload[i+add_fields+subActivities][0] = ' ';
            	
            	
            	add_fields += subActivities +1;
            }
            
            $scope.activitiesDownload[i+add_fields]= new Array();
        	$scope.activitiesDownload[i+add_fields][0] = $scope.tr_c.Total;
        	$scope.activitiesDownload[i+add_fields][1] = $scope.totalactivitiesfac;
        	$scope.activitiesDownload[i+add_fields][2] = $scope.totaltHWIC;
        	$scope.activitiesDownload[i+add_fields][3] = $scope.totalrHWIC;
        	$scope.activitiesDownload[i+add_fields][4] = $scope.totaldHWIC;
        	$scope.activitiesDownload[i+add_fields][5] = $scope.totaluHWIC;
        	$scope.activitiesDownload[i+add_fields][6] = $scope.totaltHWOC;
        	$scope.activitiesDownload[i+add_fields][7] = $scope.totalrHWOC;
        	$scope.activitiesDownload[i+add_fields][8] = $scope.totaldHWOC;
        	$scope.activitiesDownload[i+add_fields][9] = $scope.totaluHWOC;
        	$scope.activitiesDownload[i+add_fields][10] = $scope.totalthaz;
        	$scope.activitiesDownload[i+add_fields][11] = $scope.totalrhaz;
        	$scope.activitiesDownload[i+add_fields][12] = $scope.totaldhaz;
        	$scope.activitiesDownload[i+add_fields][13] = $scope.totaluhaz;
        	$scope.activitiesDownload[i+add_fields][14] = $scope.totaltNONHW;
        	$scope.activitiesDownload[i+add_fields][15] = $scope.totalrNONHW;
        	$scope.activitiesDownload[i+add_fields][16] = $scope.totaldNONHW;
        	$scope.activitiesDownload[i+add_fields][17] = $scope.totaluNONHW;
        }
        
        $scope.updateAreasData = function()
        {
        	$scope.areas = angular.copy($scope.items);
         	$scope.totalareasfac = $scope.cf.getSubSum($scope.areas,"facilityCount");
        	$scope.totalareastHWIC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWIC","unitCodeHWIC");
        	$scope.totalareasrHWIC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWIC","unitCodeHWIC");
        	$scope.totalareasdHWIC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWIC","unitCodeHWIC");
        	$scope.totalareasuHWIC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWIC","unitCodeHWIC");
        	
        	$scope.totalareastHWOC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWOC","unitCodeHWOC");
        	$scope.totalareasrHWOC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWOC","unitCodeHWOC");
        	$scope.totalareasdHWOC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWOC","unitCodeHWOC");
        	$scope.totalareasuHWOC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWOC","unitCodeHWOC");
        	
        	$scope.totalareasthaz = $scope.cf.getSubSum($scope.areas,"quantityTotalHW","unitCodeNONHW");
        	$scope.totalareasrhaz = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHW","unitCodeNONHW");
        	$scope.totalareasdhaz = $scope.cf.getSubSum($scope.areas,"quantityDisposalHW","unitCodeNONHW");
        	$scope.totalareasuhaz = $scope.cf.getSubSum($scope.areas,"quantityUnspecHW","unitCodeNONHW");
        	
        	$scope.totalareastNONHW = $scope.cf.getSubSum($scope.areas,"quantityTotalNONHW","unitCodeNONHW");
        	$scope.totalareasrNONHW = $scope.cf.getSubSum($scope.areas,"quantityRecoveryNONHW","unitCodeNONHW");
        	$scope.totalareasdNONHW = $scope.cf.getSubSum($scope.areas,"quantityDisposalNONHW","unitCodeNONHW");
        	$scope.totalareasuNONHW = $scope.cf.getSubSum($scope.areas,"quantityUnspecNONHW","unitCodeNONHW");
        	$scope.setAreaRegion();
        };
        
        $scope.updateAreasDownloadData = function() {
        	$scope.areasDownload= new Array();
            var add_fields = 5;
            
            $scope.topInfoDownload($scope.areasDownload);
            
            $scope.areasDownload[add_fields]= new Array();
            $scope.areasDownload[add_fields][0] = $scope.tr_wt.TransferPerCountry;
        	$scope.areasDownload[add_fields][1] = $scope.tr_c.Facilities;
        	$scope.areasDownload[add_fields][2] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Total +')';
        	$scope.areasDownload[add_fields][3] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Recovery +')';
        	$scope.areasDownload[add_fields][4] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.Disposal +')';
        	$scope.areasDownload[add_fields][5] = $scope.tr_c.HazardousDomestic + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.areasDownload[add_fields][6] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Total +')';
        	$scope.areasDownload[add_fields][7] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Recovery +')';
        	$scope.areasDownload[add_fields][8] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.Disposal +')';
        	$scope.areasDownload[add_fields][9] = $scope.tr_c.HazardousTransboundary + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.areasDownload[add_fields][10] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Total +')';
        	$scope.areasDownload[add_fields][11] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Recovery +')';
        	$scope.areasDownload[add_fields][12] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.Disposal +')';
        	$scope.areasDownload[add_fields][13] = $scope.tr_c.HazardousTotal + '('+ $scope.tr_c.NonHazardousTotal +')';
        	$scope.areasDownload[add_fields][14] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Total +')';
        	$scope.areasDownload[add_fields][15] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Recovery +')';
        	$scope.areasDownload[add_fields][16] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.Disposal +')';
        	$scope.areasDownload[add_fields][17] = $scope.tr_c.NonHazardousTotal + '('+ $scope.tr_c.NonHazardousTotal +')';

        	add_fields += 1;
        	
        	var areas = $scope.areas.sort(function(a, b) {
        	    return a.key - b.key;
        	});
        	
            for(var i =0; i<areas.length;i++){
            	var subAreas = 0;
            	var area = areas[i];
            	$scope.areasDownload[i+add_fields]= new Array();
            	$scope.areasDownload[i+add_fields][0] = $scope.tr_lco[area.key];
            	$scope.areasDownload[i+add_fields][1] = $scope.cf.getTypeCount(area.data);
            	$scope.areasDownload[i+add_fields][2] = $scope.cf.getSum(area.data,"quantityTotalHWIC","unitCodeHWIC");
            	$scope.areasDownload[i+add_fields][3] = $scope.cf.getSum(area.data,"quantityRecoveryHWIC","unitCodeHWIC");
            	$scope.areasDownload[i+add_fields][4] = $scope.cf.getSum(area.data,"quantityDisposalHWIC","unitCodeHWIC");
            	$scope.areasDownload[i+add_fields][5] = $scope.cf.getSum(area.data,"quantityUnspecHWIC","unitCodeHWIC");
            	$scope.areasDownload[i+add_fields][6] = $scope.cf.getSum(area.data,"quantityTotalHWOC","unitCodeHWOC");
            	$scope.areasDownload[i+add_fields][7] = $scope.cf.getSum(area.data,"quantityRecoveryHWOC","unitCodeHWOC");
            	$scope.areasDownload[i+add_fields][8] = $scope.cf.getSum(area.data,"quantityDisposalHWOC","unitCodeHWOC");
            	$scope.areasDownload[i+add_fields][9] = $scope.cf.getSum(area.data,"quantityUnspecHWOC","unitCodeHWOC");
            	$scope.areasDownload[i+add_fields][10] = $scope.cf.getSum(area.data,"quantityTotalHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][11] = $scope.cf.getSum(area.data,"quantityRecoveryHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][12] = $scope.cf.getSum(area.data,"quantityDisposalHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][13] = $scope.cf.getSum(area.data,"quantityUnspecHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][14] = $scope.cf.getSum(area.data,"quantityTotalNONHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][15] = $scope.cf.getSum(area.data,"quantityRecoveryNONHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][16] = $scope.cf.getSum(area.data,"quantityDisposalNONHW","unitCodeNONHW");
            	$scope.areasDownload[i+add_fields][17] = $scope.cf.getSum(area.data,"quantityUnspecNONHW","unitCodeNONHW");
            	
            	area.data.sort(function(a, b) {
            		if($scope.regionSearch){
            			return $scope.tr_lnr[a.nutslevel2RegionCode].valueOf() - $scope.tr_lnr[b.nutslevel2RegionCode].valueOf();
            		}else{
            			return $scope.tr_lrbd[a.riverBasinDistrictCode].valueOf() - $scope.tr_lrbd[b.riverBasinDistrictCode].valueOf();
            		}
            	});
            	
            	if(area.hasOwnProperty('data')){
                	for(var j =0; j<area.data.length;j++){
                		var subArea = area.data[j];
                		
                		var areaName ="";
                    	if($scope.regionSearch){
                    		areaName = $scope.tr_lnr[subArea.nutslevel2RegionCode];
                    	}else
                    		areaName = $scope.tr_lrbd[subArea.riverBasinDistrictCode];
                		
                		$scope.areasDownload[i+add_fields+(++subAreas)]= new Array();
                    	$scope.areasDownload[i+add_fields+subAreas][0] = areaName;
                    	$scope.areasDownload[i+add_fields+subAreas][1] = $scope.cf.getTypeCount(subArea,"facility");
                    	$scope.areasDownload[i+add_fields+subAreas][2] = $scope.cf.getSum(subArea,"quantityTotalHWIC","unitCodeHWIC");
                    	$scope.areasDownload[i+add_fields+subAreas][3] = $scope.cf.getSum(subArea,"quantityRecoveryHWIC","unitCodeHWIC");
                    	$scope.areasDownload[i+add_fields+subAreas][4] = $scope.cf.getSum(subArea,"quantityDisposalHWIC","unitCodeHWIC");
                    	$scope.areasDownload[i+add_fields+subAreas][5] = $scope.cf.getSum(subArea,"quantityUnspecHWIC","unitCodeHWIC");
                    	$scope.areasDownload[i+add_fields+subAreas][6] = $scope.cf.getSum(subArea,"quantityTotalHWOC","unitCodeHWOC");
                    	$scope.areasDownload[i+add_fields+subAreas][7] = $scope.cf.getSum(subArea,"quantityRecoveryHWOC","unitCodeHWOC");
                    	$scope.areasDownload[i+add_fields+subAreas][8] = $scope.cf.getSum(subArea,"quantityDisposalHWOC","unitCodeHWOC");
                    	$scope.areasDownload[i+add_fields+subAreas][9] = $scope.cf.getSum(subArea,"quantityUnspecHWOC","unitCodeHWOC");
                    	$scope.areasDownload[i+add_fields+subAreas][10] = $scope.cf.getSum(subArea,"quantityTotalHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][11] = $scope.cf.getSum(subArea,"quantityRecoveryHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][12] = $scope.cf.getSum(subArea,"quantityDisposalHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][13] = $scope.cf.getSum(subArea,"quantityUnspecHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][14] = $scope.cf.getSum(subArea,"quantityTotalNONHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][15] = $scope.cf.getSum(subArea,"quantityRecoveryNONHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][16] = $scope.cf.getSum(subArea,"quantityDisposalNONHW","unitCodeNONHW");
                    	$scope.areasDownload[i+add_fields+subAreas][17] = $scope.cf.getSum(subArea,"quantityUnspecNONHW","unitCodeNONHW");
                	}
            	}
            	$scope.areasDownload[i+add_fields+(++subAreas)]= new Array();
            	$scope.areasDownload[i+add_fields+subAreas][0] = ' ';
            	
            	add_fields += subAreas+1;
            }
            add_fields = $scope.areasDownload.length + 1;
            $scope.areasDownload[add_fields]= new Array();
        	$scope.areasDownload[add_fields][0] = $scope.tr_c.Total;
        	$scope.areasDownload[add_fields][1] = $scope.totalareasfac;
        	$scope.areasDownload[add_fields][2] = $scope.totalareastHWIC;
        	$scope.areasDownload[add_fields][3] = $scope.totalareasrHWIC;
        	$scope.areasDownload[add_fields][4] = $scope.totalareasdHWIC;
        	$scope.areasDownload[add_fields][5] = $scope.totalareasuHWIC;
        	$scope.areasDownload[add_fields][6] = $scope.totalareastHWOC;
        	$scope.areasDownload[add_fields][7] = $scope.totalareasrHWOC;
        	$scope.areasDownload[add_fields][8] = $scope.totalareasdHWOC;
        	$scope.areasDownload[add_fields][9] = $scope.totalareasuHWOC;
        	$scope.areasDownload[add_fields][10] = $scope.totalareasthaz;
        	$scope.areasDownload[add_fields][11] = $scope.totalareasrhaz;
        	$scope.areasDownload[add_fields][12] = $scope.totalareasdhaz;
        	$scope.areasDownload[add_fields][13] = $scope.totalareasuhaz;
        	$scope.areasDownload[add_fields][14] = $scope.totalareastNONHW;
        	$scope.areasDownload[add_fields][15] = $scope.totalareasrNONHW;
        	$scope.areasDownload[add_fields][16] = $scope.totalareasdNONHW;
        	$scope.areasDownload[add_fields][17] = $scope.totalareasuNONHW;
        }
        
        $scope.updateAreaComparisonData = function()
        {
        	// Graph
        };        
        
        $scope.updateFacilitiesData = function()
        {
        	$scope.facilitiesItems  = angular.copy($scope.items);
        };
        
        $scope.updateFacilitiesDownloadData = function() {
        	$scope.facilitiesDownload= new Array();
            var top_fields = 5;
            
            $scope.topInfoDownload($scope.facilitiesDownload);
            
            $scope.facilitiesDownload[top_fields]= new Array();
            $scope.facilitiesDownload[top_fields][0] = $scope.tr_c.Facility;
        	$scope.facilitiesDownload[top_fields][1] = $scope.tr_c.Total;
        	$scope.facilitiesDownload[top_fields][2] = $scope.tr_c.Recovery;
        	$scope.facilitiesDownload[top_fields][3] = $scope.tr_c.Disposal;
        	$scope.facilitiesDownload[top_fields][4] = $scope.tr_c.Unspec;
        	$scope.facilitiesDownload[top_fields][5] = $scope.tr_c.Activity;
        	$scope.facilitiesDownload[top_fields][6] = $scope.tr_c.Country;

        	top_fields += 1;
        	
            for(var i =0; i<$scope.facilitiesCompleteItems.length;i++){
            	var facility = $scope.facilitiesCompleteItems[i];
            	$scope.facilitiesDownload[i+top_fields]= new Array();
            	$scope.facilitiesDownload[i+top_fields][0] = facility.facilityName;
            	$scope.facilitiesDownload[i+top_fields][1] = $scope.ff.formatQuantity(facility.quantityTotal,facility.unitCodeHWOC,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][2] = $scope.ff.formatQuantity(facility.quantityRecovery,facility.unitCodeHWOC,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][3] = $scope.ff.formatQuantity(facility.quantityDisposal,facility.unitCodeHWOC,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][4] = $scope.ff.formatQuantity(facility.quantityUnspec,facility.unitCodeHWOC,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][5] = facility.Activity;
            	$scope.facilitiesDownload[i+top_fields][6] = $scope.tr_lco[facility.countryCode];
            }
        }
        
        $scope.updateHaztransboundaryData = function()
        {
        	console.dir('updateHaztransboundaryData');
        };
        
        $scope.updateTransboundaryDownloadData = function() {
        	$scope.transboundaryDownload= new Array();
            var top_fields = 5;
            
            $scope.topInfoDownload($scope.transboundaryDownload);
            
            $scope.transboundaryDownload[top_fields]= new Array();
            $scope.transboundaryDownload[top_fields][0] = $scope.tr_cl["FROM_COUNTRY"];
            $scope.transboundaryDownload[top_fields][1] = $scope.tr_cl["TO_COUNTRY"];
        	$scope.transboundaryDownload[top_fields][2] = $scope.tr_cl["QUANTITY"]+ " " + $scope.tr_cl["DISPOSAL"];
        	$scope.transboundaryDownload[top_fields][3] = $scope.tr_cl["QUANTITY"]+ " " + $scope.tr_cl["RECOVERY"];
        	$scope.transboundaryDownload[top_fields][4] = $scope.tr_cl["QUANTITY"];
        	$scope.transboundaryDownload[top_fields][5] = $scope.tr_c.Facilities;

        	top_fields += 1;
        	
        	var htd = $scope.hazTransboundaryData.data.sort(function(a, b) {
        		if(a.transferFrom.localeCompare(b.transferFrom) === 0){
        			return a.transferTo.localeCompare(b.transferTo);
        		}else{
        			return a.transferFrom.localeCompare(b.transferFrom);
        		}
        	});
        	
            for(var i =0; i<htd.length;i++){
            	var transboundary = htd[i];
            	$scope.transboundaryDownload[i+top_fields]= new Array();
            	$scope.transboundaryDownload[i+top_fields][0] = $scope.tr_lco[transboundary.transferFrom];
            	$scope.transboundaryDownload[i+top_fields][1] = $scope.tr_lco[transboundary.transferTo];
            	$scope.transboundaryDownload[i+top_fields][2] = transboundary.quantityDisposal=== null? 0: transboundary.quantityDisposal;
            	$scope.transboundaryDownload[i+top_fields][3] = transboundary.quantityRecovery=== null? 0: transboundary.quantityRecovery;
            	$scope.transboundaryDownload[i+top_fields][4] = transboundary.quantityTotal;
            	$scope.transboundaryDownload[i+top_fields][5] = transboundary.facilities;
            }
        }
        
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
        
        $scope.openFDmodal = function (fdID, fdrID, year) {

            var modalInstance = $modal.open({
              templateUrl: 'components/facilitydetails/fdmodal.html',
              controller: 'ModalFacilityDetailsCtrl',
                size: 'lg',
              resolve: {
                 fdrID: function () {
                    return fdrID;
                },
                fdID: function () {
                    return fdID;
                },
                year: function() {
                    return year;
                }

            }
        });
        };
 
       
    }])

;