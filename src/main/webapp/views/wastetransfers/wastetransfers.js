'use strict';

angular.module('myApp.wastetransfers', ['ngRoute', 'myApp.search-filter', 'restangular','ngSanitize',
                                        'myApp.wastetransferconfidential','myApp.wasteAreaComparison','myApp.hazTransboundary','myApp.HazReceiversWasteTab'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wastetransfers', {
            templateUrl: 'views/wastetransfers/wastetransfers.html',
            controller: 'WasteTransfersCtrl'
        });
    }])

    .controller('WasteTransfersCtrl', ['$scope', '$filter', '$modal', 'searchFilter', 'Restangular',
                                       'translationService','formatStrFactory','countFactory', function($scope, $filter, $modal, 
                                    		   searchFilter, Restangular,translationService,formatStrFactory,countFactory) {

    	$scope.bigmap = false;
    	$scope.mapctrl = {};
    	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
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

        $scope.showhazreceivers = false;

        
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
        		$scope.tr_cl = data.ChartLabels;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        		
        		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];

        	  });
        };
        $scope.translate();
        
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
                  	case "HAZ. TRANSBOUNDARY":
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
       			formatStrFactory.getStrFormat($scope.summaryItems[i].quantityRecovery);
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
            		
        	}else if(tab === 'transboundary'){
        		$scope.updateTransboundaryDownloadData();
        		contentArray = $scope.transboundaryDownload;
        		fileName = 'EPRTR_Waste_Transfer_Haz_Transboundary'+contentDate+'.csv';
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
        	$scope.totalrHWIC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWIC",true);
        	$scope.totaldHWIC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWIC",true);
        	$scope.totaluHWIC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWIC",true);
        	
        	$scope.totaltHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC",true);
        	$scope.totalrHWOC = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHWOC",true);
        	$scope.totaldHWOC = $scope.cf.getSubSum($scope.activities,"quantityDisposalHWOC",true);
        	$scope.totaluHWOC = $scope.cf.getSubSum($scope.activities,"quantityUnspecHWOC",true);
        	
        	$scope.totalthaz = $scope.cf.getSubSum($scope.activities,"quantityTotalHW",true);
        	$scope.totalrhaz = $scope.cf.getSubSum($scope.activities,"quantityRecoveryHW",true);
        	$scope.totaldhaz = $scope.cf.getSubSum($scope.activities,"quantityDisposalHW",true);
        	$scope.totaluhaz = $scope.cf.getSubSum($scope.activities,"quantityUnspecHW",true);
        	
        	$scope.totaltNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW",true);
        	$scope.totalrNONHW = $scope.cf.getSubSum($scope.activities,"quantityRecoveryNONHW",true);
        	$scope.totaldNONHW = $scope.cf.getSubSum($scope.activities,"quantityDisposalNONHW",true);
        	$scope.totaluNONHW = $scope.cf.getSubSum($scope.activities,"quantityUnspecNONHW",true);
        	
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
            	$scope.activitiesDownload[i+add_fields][2] = $scope.cf.getSum(activity.data,"quantityTotalHWIC",true);
            	$scope.activitiesDownload[i+add_fields][3] = $scope.cf.getSum(activity.data,"quantityRecoveryHWIC",true);
            	$scope.activitiesDownload[i+add_fields][4] = $scope.cf.getSum(activity.data,"quantityDisposalHWIC",true);
            	$scope.activitiesDownload[i+add_fields][5] = $scope.cf.getSum(activity.data,"quantityUnspecHWIC",true);
            	$scope.activitiesDownload[i+add_fields][6] = $scope.cf.getSum(activity.data,"quantityTotalHWOC",true);
            	$scope.activitiesDownload[i+add_fields][7] = $scope.cf.getSum(activity.data,"quantityRecoveryHWOC",true);
            	$scope.activitiesDownload[i+add_fields][8] = $scope.cf.getSum(activity.data,"quantityDisposalHWOC",true);
            	$scope.activitiesDownload[i+add_fields][9] = $scope.cf.getSum(activity.data,"quantityUnspecHWOC",true);
            	$scope.activitiesDownload[i+add_fields][10] = $scope.cf.getSum(activity.data,"quantityTotalHW",true);
            	$scope.activitiesDownload[i+add_fields][11] = $scope.cf.getSum(activity.data,"quantityRecoveryHW",true);
            	$scope.activitiesDownload[i+add_fields][12] = $scope.cf.getSum(activity.data,"quantityDisposalHW",true);
            	$scope.activitiesDownload[i+add_fields][13] = $scope.cf.getSum(activity.data,"quantityUnspecHW",true);
            	$scope.activitiesDownload[i+add_fields][14] = $scope.cf.getSum(activity.data,"quantityTotalNONHW",true);
            	$scope.activitiesDownload[i+add_fields][15] = $scope.cf.getSum(activity.data,"quantityRecoveryNONHW",true);
            	$scope.activitiesDownload[i+add_fields][16] = $scope.cf.getSum(activity.data,"quantityDisposalNONHW",true);
            	$scope.activitiesDownload[i+add_fields][17] = $scope.cf.getSum(activity.data,"quantityUnspecNONHW",true);
            	
            	activity.data = activity['data'].sort(function(a, b) {
            	    return a.iaactivityCode - b.iaactivityCode;
            	});
            	
            	for(var j =0; j<activity.data.length;j++){
            		var subActivity = activity.data[j];
            		$scope.activitiesDownload[i+add_fields+(++subActivities)]= new Array();
                	$scope.activitiesDownload[i+add_fields+subActivities][0] = $scope.tr_laa[subActivity.iaActivityCode];
                	$scope.activitiesDownload[i+add_fields+subActivities][1] = $scope.cf.getTypeCount(subActivity);
                	$scope.activitiesDownload[i+add_fields+subActivities][2] = $scope.cf.getSum(subActivity,"quantityTotalHWIC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][3] = $scope.cf.getSum(subActivity,"quantityRecoveryHWIC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][4] = $scope.cf.getSum(subActivity,"quantityDisposalHWIC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][5] = $scope.cf.getSum(subActivity,"quantityUnspecHWIC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][6] = $scope.cf.getSum(subActivity,"quantityTotalHWOC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][7] = $scope.cf.getSum(subActivity,"quantityRecoveryHWOC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][8] = $scope.cf.getSum(subActivity,"quantityDisposalHWOC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][9] = $scope.cf.getSum(subActivity,"quantityUnspecHWOC",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][10] = $scope.cf.getSum(subActivity,"quantityTotalHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][11] = $scope.cf.getSum(subActivity,"quantityRecoveryHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][12] = $scope.cf.getSum(subActivity,"quantityDisposalHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][13] = $scope.cf.getSum(subActivity,"quantityUnspecHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][14] = $scope.cf.getSum(subActivity,"quantityTotalNONHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][15] = $scope.cf.getSum(subActivity,"quantityRecoveryNONHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][16] = $scope.cf.getSum(subActivity,"quantityDisposalNONHW",true);
                	$scope.activitiesDownload[i+add_fields+subActivities][17] = $scope.cf.getSum(subActivity,"quantityUnspecNONHW",true);
                	
                	if(subActivity.hasOwnProperty('sublevel') && subActivity.sublevel instanceof Array && subActivity.sublevel.length >=0){
                		subActivity.sublevel= subActivity.sublevel.sort(function(a, b) {
                			return $scope.roman(a.iaSubActivityCode.substring(7, a.iaSubActivityCode.length-1))- $scope.roman(b.iaSubActivityCode.substring(7, b.iaSubActivityCode.length-1));
                    	});
                		
                		for(var k =0; k< subActivity.sublevel.length ;k++){
                    		var subSubActivity = subActivity.sublevel[k];
                    		$scope.activitiesDownload[i+add_fields+(++subActivities)]= new Array();
                        	$scope.activitiesDownload[i+add_fields+subActivities][0] = $scope.tr_laa[subSubActivity.iaSubActivityCode];
                        	$scope.activitiesDownload[i+add_fields+subActivities][1] = $scope.cf.getTypeCount(subSubActivity);
                        	$scope.activitiesDownload[i+add_fields+subActivities][2] = $scope.cf.getSum(subSubActivity,"quantityTotalHWIC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][3] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHWIC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][4] = $scope.cf.getSum(subSubActivity,"quantityDisposalHWIC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][5] = $scope.cf.getSum(subSubActivity,"quantityUnspecHWIC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][6] = $scope.cf.getSum(subSubActivity,"quantityTotalHWOC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][7] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHWOC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][8] = $scope.cf.getSum(subSubActivity,"quantityDisposalHWOC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][9] = $scope.cf.getSum(subSubActivity,"quantityUnspecHWOC",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][10] = $scope.cf.getSum(subSubActivity,"quantityTotalHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][11] = $scope.cf.getSum(subSubActivity,"quantityRecoveryHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][12] = $scope.cf.getSum(subSubActivity,"quantityDisposalHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][13] = $scope.cf.getSum(subSubActivity,"quantityUnspecHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][14] = $scope.cf.getSum(subSubActivity,"quantityTotalNONHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][15] = $scope.cf.getSum(subSubActivity,"quantityRecoveryNONHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][16] = $scope.cf.getSum(subSubActivity,"quantityDisposalNONHW",true);
                        	$scope.activitiesDownload[i+add_fields+subActivities][17] = $scope.cf.getSum(subSubActivity,"quantityUnspecNONHW",true);
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
        	$scope.totalareastHWIC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWIC",true);
        	$scope.totalareasrHWIC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWIC",true);
        	$scope.totalareasdHWIC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWIC",true);
        	$scope.totalareasuHWIC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWIC",true);
        	
        	$scope.totalareastHWOC = $scope.cf.getSubSum($scope.areas,"quantityTotalHWOC",true);
        	$scope.totalareasrHWOC = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHWOC",true);
        	$scope.totalareasdHWOC = $scope.cf.getSubSum($scope.areas,"quantityDisposalHWOC",true);
        	$scope.totalareasuHWOC = $scope.cf.getSubSum($scope.areas,"quantityUnspecHWOC",true);
        	
        	$scope.totalareasthaz = $scope.cf.getSubSum($scope.areas,"quantityTotalHW",true);
        	$scope.totalareasrhaz = $scope.cf.getSubSum($scope.areas,"quantityRecoveryHW",true);
        	$scope.totalareasdhaz = $scope.cf.getSubSum($scope.areas,"quantityDisposalHW",true);
        	$scope.totalareasuhaz = $scope.cf.getSubSum($scope.areas,"quantityUnspecHW",true);
        	
        	$scope.totalareastNONHW = $scope.cf.getSubSum($scope.areas,"quantityTotalNONHW",true);
        	$scope.totalareasrNONHW = $scope.cf.getSubSum($scope.areas,"quantityRecoveryNONHW",true);
        	$scope.totalareasdNONHW = $scope.cf.getSubSum($scope.areas,"quantityDisposalNONHW",true);
        	$scope.totalareasuNONHW = $scope.cf.getSubSum($scope.areas,"quantityUnspecNONHW",true);
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
            	$scope.areasDownload[i+add_fields][2] = $scope.cf.getSum(area.data,"quantityTotalHWIC",true);
            	$scope.areasDownload[i+add_fields][3] = $scope.cf.getSum(area.data,"quantityRecoveryHWIC",true);
            	$scope.areasDownload[i+add_fields][4] = $scope.cf.getSum(area.data,"quantityDisposalHWIC",true);
            	$scope.areasDownload[i+add_fields][5] = $scope.cf.getSum(area.data,"quantityUnspecHWIC",true);
            	$scope.areasDownload[i+add_fields][6] = $scope.cf.getSum(area.data,"quantityTotalHWOC",true);
            	$scope.areasDownload[i+add_fields][7] = $scope.cf.getSum(area.data,"quantityRecoveryHWOC",true);
            	$scope.areasDownload[i+add_fields][8] = $scope.cf.getSum(area.data,"quantityDisposalHWOC",true);
            	$scope.areasDownload[i+add_fields][9] = $scope.cf.getSum(area.data,"quantityUnspecHWOC",true);
            	$scope.areasDownload[i+add_fields][10] = $scope.cf.getSum(area.data,"quantityTotalHW",true);
            	$scope.areasDownload[i+add_fields][11] = $scope.cf.getSum(area.data,"quantityRecoveryHW",true);
            	$scope.areasDownload[i+add_fields][12] = $scope.cf.getSum(area.data,"quantityDisposalHW",true);
            	$scope.areasDownload[i+add_fields][13] = $scope.cf.getSum(area.data,"quantityUnspecHW",true);
            	$scope.areasDownload[i+add_fields][14] = $scope.cf.getSum(area.data,"quantityTotalNONHW",true);
            	$scope.areasDownload[i+add_fields][15] = $scope.cf.getSum(area.data,"quantityRecoveryNONHW",true);
            	$scope.areasDownload[i+add_fields][16] = $scope.cf.getSum(area.data,"quantityDisposalNONHW",true);
            	$scope.areasDownload[i+add_fields][17] = $scope.cf.getSum(area.data,"quantityUnspecNONHW",true);
            	
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
                    	$scope.areasDownload[i+add_fields+subAreas][2] = $scope.cf.getSum(subArea,"quantityTotalHWIC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][3] = $scope.cf.getSum(subArea,"quantityRecoveryHWIC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][4] = $scope.cf.getSum(subArea,"quantityDisposalHWIC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][5] = $scope.cf.getSum(subArea,"quantityUnspecHWIC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][6] = $scope.cf.getSum(subArea,"quantityTotalHWOC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][7] = $scope.cf.getSum(subArea,"quantityRecoveryHWOC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][8] = $scope.cf.getSum(subArea,"quantityDisposalHWOC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][9] = $scope.cf.getSum(subArea,"quantityUnspecHWOC",true);
                    	$scope.areasDownload[i+add_fields+subAreas][10] = $scope.cf.getSum(subArea,"quantityTotalHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][11] = $scope.cf.getSum(subArea,"quantityRecoveryHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][12] = $scope.cf.getSum(subArea,"quantityDisposalHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][13] = $scope.cf.getSum(subArea,"quantityUnspecHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][14] = $scope.cf.getSum(subArea,"quantityTotalNONHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][15] = $scope.cf.getSum(subArea,"quantityRecoveryNONHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][16] = $scope.cf.getSum(subArea,"quantityDisposalNONHW",true);
                    	$scope.areasDownload[i+add_fields+subAreas][17] = $scope.cf.getSum(subArea,"quantityUnspecNONHW",true);
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
            	$scope.facilitiesDownload[i+top_fields][1] = $scope.ff.formatMethod(facility.quantityTotal,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][2] = $scope.ff.formatMethod(facility.quantityRecovery,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][3] = $scope.ff.formatMethod(facility.quantityDisposal,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][4] = $scope.ff.formatMethod(facility.quantityUnspec,facility.confidentialIndicator);
            	$scope.facilitiesDownload[i+top_fields][5] = facility.Activity;
            	$scope.facilitiesDownload[i+top_fields][6] = $scope.tr_lco[facility.countryCode];
            }
        }
        
        $scope.updateHaztransboundaryData = function()
        {
        	
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
 
       
    }])

;