'use strict';

angular.module('myApp.areaoverview', ['ngRoute', 'myApp.search-filter', 
                                      'restangular','myApp.areaOverviewWasteTab', 'myApp.areaOverviewPtTab', 'myApp.areaOverviewPrTab'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/areaoverview', {
    templateUrl: 'views/areaoverview/areaoverview.html',
    controller: 'AreaOverviewCtrl'
  });
}])



.controller('AreaOverviewCtrl', ['$scope', '$filter', 'searchFilter', 'Restangular', 'eprtrcms', 
                                 'lovCountryType', 'lovAreaGroupType', 'lovNutsRegionType', 'riverBasinDistrictsType', 'countFactory', 'formatStrFactory',
                                 function($scope, $filter, searchFilter, Restangular, eprtrcms,
                                		 lovCountryType, lovAreaGroupType, lovNutsRegionType, riverBasinDistrictsType, countFactory, formatStrFactory) {
	
	$scope.beforesearch = true;
    $scope.searchFilter = searchFilter;
    $scope.queryParams = {};
    $scope.queryParams.ReportingYear = -1;
	$scope.headitms = [];
	$scope.prMedium = {};
	$scope.pritems = {};
	$scope.prHeaderItems= {};
	$scope.ptitems = {};
	$scope.ptHeaderItems= {};
	$scope.wasteTransferItems = {};
    $scope.searchResults = false;
    $scope.cf = countFactory;
    $scope.ff = formatStrFactory;
    $scope.med = 'quantityAir';
    $scope.resize_icon = "fa fa-arrow-left"
    $scope.bigmap = false;
    $scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    $scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    $scope.mapctrl = {};
	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -230)+'px';


//	Requesting text and title resources 
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
	eprtrcms.get('AreaOverview',null).then(function (data) {
		$scope.tr_ao = data;
	});
	eprtrcms.get('LOV_RIVERBASINDISTRICT',null).then(function (data) {
		$scope.tr_lrbd = data;
	});
	eprtrcms.get('LOV_AREAGROUP',null).then(function (data) {
		$scope.tr_lag = data;
	});
	eprtrcms.get('WasteTransfers',null).then(function (data) {
		$scope.tr_wt = data;
	});
	eprtrcms.get('LOV_ANNEXIACTIVITY',null).then(function (data) {
		$scope.tr_laa = data;
	});
    
    $scope.$watchCollection('[pritems.data, prHeaderItems.data ,ptitems.data, ptHeaderItems.data, wasteTransferItems.data]', function(value) {
//    	console.log("HTD is there.");
    });
	
    $scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });

    $scope.$watch('prMedium', function(value){
    	if($scope.prfilter && $scope.prfilter.prsel){
    		$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watch('prfilter.pgselect', function(value){
    	if($scope.prfilter && $scope.prfilter.prsel){
    		$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watchCollection('[queryParams,prfilter]', function(value){
    	if($scope.queryParams){
//        	if($scope.queryParams && $scope.queryParams.LOV_PollutantGroupID){
    		$scope.mediumParams = angular.copy($scope.queryParams);
    		//$scope.medium = $scope.prMedium;
    	}
    });
    
    $scope.$watch('pritems', function(value){
    	if($scope.pritems){
    		//console.log
    	}
    });
    
    /**
     * MAp handling*/
    $scope.togglemapview = function(){
    	if($scope.bigmap){
        	$scope.bigmap = false;
        	$scope.resize_icon = "fa fa-arrow-left"
        	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
        	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
    	}
    	else{
        	$scope.bigmap = true;
        	$scope.resize_icon = "fa fa-arrow-right"
        	$scope.mapclss = "col-md-12 minor-padding";
        	$scope.resclss = "col-md-12 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowReducedMap'];
    	}
    	$scope.mapctrl.redraw();
    }
    
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
    $scope.active.pollutantrelease = true;

    $scope.createheader = function(){
    	$scope.headitms = [];
    	/* HEADER PART FOR ReleaseYear*/
    	$scope.headitms.push({'order':0, 'clss':'fdTitles', 'title':$scope.tr_c.Year, 'val':$scope.queryParams.ReportingYear});

    	/* HEADER PART FOR AREA*/
    	var area = {'order':1,	'clss':'fdTitles', 'title':$scope.tr_c.Area};
    	if($scope.queryParams.LOV_AreaGroupID != undefined){
    		// Get list of Countries using AreaGroup ID
    		lovAreaGroupType.getByID($scope.queryParams.LOV_AreaGroupID).get().then(function(data) {
    			area.val = $scope.tr_lag[data.code];
    			$scope.headitms.push(area);
    		});
    	}
    	else if($scope.queryParams.LOV_CountryID != undefined){
    		//We use LOV_NUTSRegionID for title
    		//"lov_NUTSRLevel1ID":704,"lov_NUTSRLevel2ID":709,"lov_NUTSRLevel3ID":null
    		if($scope.queryParams.LOV_NUTSRegionID != undefined){
    			lovNutsRegionType.getByID($scope.queryParams.LOV_NUTSRegionID).get().then(function(data) {
    				area.val = $scope.tr_lnr[data.code];
    				$scope.headitms.push(area);
    			});
    		}
    		//We use LOV_RiverBasinDistrictID for title
    		else if($scope.queryParams.LOV_RiverBasinDistrictID != undefined){
    			riverBasinDistrictsType.getByID($scope.queryParams.LOV_RiverBasinDistrictID).get().then(function(data) {
    				area.val = $scope.tr_lrbd[data.code];
    				$scope.headitms.push(area);
    			});
    		}
    		//We use LOV_CountryID for title
    		else{
    			lovCountryType.getByID($scope.queryParams.LOV_CountryID).get().then(function(data) {
    				area.val = $scope.tr_lco[data.countryCode];
    				$scope.headitms.push(area);
    			});
    		}
    	}
    }
  
	$scope.search = function() {
		$scope.beforesearch = false;
        $scope.performSearch();
    }
	
	$scope.performSearch = function() {
        var queryParams = {ReportingYear: $scope.searchFilter.selectedReportingYear.year};
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            queryParams.LOV_CountryID = $scope.searchFilter.selectedReportingCountry.countryId;
            if ($scope.searchFilter.selectedRegion.lov_NUTSRegionID) {
                queryParams.LOV_NUTSRegionID = $scope.searchFilter.selectedRegion.lov_NUTSRegionID;
            }
            else if ($scope.searchFilter.selectedRegion.lov_RiverBasinDistrictID) {
                queryParams.LOV_RiverBasinDistrictID = $scope.searchFilter.selectedRegion.lov_RiverBasinDistrictID;
            }
        }
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.groupId) {
            queryParams.LOV_AreaGroupID = $scope.searchFilter.selectedReportingCountry.groupId;
        }
        $scope.queryParams = queryParams;
        
        $scope.headitms = [];
        $scope.createheader();
        $scope.hasConfidential();
        
        $scope.searchResults = true;
	}
	
	$scope.hasConfidential = function(){
		$scope.hasConfidentionalData = false;
		
        var confidentialParams = angular.copy($scope.queryParams);
        if(confidentialParams.LOV_PollutantID)
        {
        	delete confidentialParams.LOV_PollutantID;
        }
        if(confidentialParams.LOV_PollutantGroupID)
        {
        	delete confidentialParams.LOV_PollutantGroupID;
        }
        confidentialParams.ConfidentialIndicator = 1;

        var rest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        // Pollutant Releases
        var isPRconfservice = rest.all('pollutantreleaseSearch');
        isPRconfservice.getList(confidentialParams).then(function(response) {
        	$scope.hasConfidentionalData = (response.data === 'true');
        });

        // Pollutant Transfers
		var isPTconfservice = rest.one('pollutanttransferIsConfidential');
		isPTconfservice.get(confidentialParams).then(function(response) {
            $scope.hasConfidentionalData = (response.data === 'true');
        });

        // Waste Transfers
		var isWTconfservice = rest.one('wastetransferIsConfidential');
		isWTconfservice.get(confidentialParams).then(function(response) {
            $scope.hasConfidentionalData = (response.data === 'true');
        });
		
	}
	
	$scope.downloadClick = function(tab){

    	var contentArray = new Array();
    	var contentAvailable = true;
    	var fileName = '';
    	var date = new Date();
    	var dateString = '_'+ date.getFullYear() +'_'+date.getMonth()+'_'+date.getDate();
    	if(tab === 'wasteTransfer'){
    		$scope.updateWasteTransferDownloadData();
    		contentArray = $scope.wasteTransferDownload;
    		fileName = 'EPRTR_Area_Overview_Waste_Transfer'+dateString+'.csv';
    	}else if(tab ==='pollutantRelease' && $scope.pritems.data != undefined){
    		$scope.pollutantReleaseDownload= new Array();
    		$scope.updatePollutantDownloadData($scope.pritems,$scope.pollutantReleaseDownload, $scope.prHeaderItems );
    		contentArray = $scope.pollutantReleaseDownload;
    		fileName = 'EPRTR_Area_Overview_Pollutant_Release'+dateString+'.csv';
    	}else if(tab === 'pollutantTransfer' && $scope.ptitems.data != undefined){
    		$scope.pollutantTransferDownload= new Array();
    		$scope.updatePollutantDownloadData($scope.ptitems,$scope.pollutantTransferDownload, $scope.ptHeaderItems );
    		contentArray = $scope.pollutantTransferDownload;
    		fileName = 'EPRTR_Area_Overview_Pollutant_Transfer'+dateString+'.csv';
    	}else{
    		contentAvailable = false;
    	}

    	var csvContent = 'data:text/csv;charset=utf-8,';
    	contentArray.forEach(function(infoArray, index){

    		var dataString = infoArray.join(';').split();
    		csvContent += dataString + "\n";
    	});
    	
    	var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", fileName);
		if(contentAvailable){
			link.click(); // This will download the data file named "my_data.csv".
		}

    }
	
	$scope.updateWasteTransferDownloadData = function(){
		$scope.wasteTransferDownload= new Array();
        var add_fields = 4;
        
        $scope.topInfoDownload($scope.wasteTransferDownload);
        
        $scope.wasteTransferDownload[add_fields]= new Array();
        $scope.wasteTransferDownload[add_fields][0] = $scope.tr_wt.TransferPerIndustrialActivity;
    	$scope.wasteTransferDownload[add_fields][1] = $scope.tr_c.HazardousDomestic + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][2] = $scope.tr_c.HazardousDomestic  + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][3] = $scope.tr_c.HazardousTransboundary + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][4] = $scope.tr_c.HazardousTransboundary   + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][5] = $scope.tr_c.HazardousTotal + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][6] = $scope.tr_c.HazardousTotal   + ' - ' + $scope.tr_c.Facilities;
    	$scope.wasteTransferDownload[add_fields][7] = $scope.tr_c.NonHazardousTotal + ' - ' + $scope.tr_c.Quantity;
    	$scope.wasteTransferDownload[add_fields][8] = $scope.tr_c.NonHazardousTotal   + ' - ' + $scope.tr_c.Facilities;

    	add_fields += 1;
    	
    	var wasteTransfer = $scope.wasteTransferItems.data.sort(function(a, b) {
    	    return a.key - b.key;
    	});
    	
        for(var i =0; i<wasteTransfer.length;i++){
        	var subItems = 0;
        	var item = wasteTransfer[i];
        	$scope.wasteTransferDownload[i+add_fields]= new Array();
        	$scope.wasteTransferDownload[i+add_fields][0] = $scope.tr_laa[item.key];
        	$scope.wasteTransferDownload[i+add_fields][1] = $scope.cf.getSum(item.data,"quantityTotalHWIC",false);
        	$scope.wasteTransferDownload[i+add_fields][2] = $scope.cf.getSum(item.data,"facilityCountHWIC",false);
        	$scope.wasteTransferDownload[i+add_fields][3] = $scope.cf.getSum(item.data,"quantityTotalHWOC",true);
        	$scope.wasteTransferDownload[i+add_fields][4] = $scope.cf.getSum(item.data,"facilityCountHWOC",false);
        	$scope.wasteTransferDownload[i+add_fields][5] = $scope.cf.getSum(item.data,"quantityTotalHW",true);
        	$scope.wasteTransferDownload[i+add_fields][6] = $scope.cf.getSum(item.data,"facilityCountHW",false);
        	$scope.wasteTransferDownload[i+add_fields][7] = $scope.cf.getSum(item.data,"quantityTotalNONHW",true);
        	$scope.wasteTransferDownload[i+add_fields][8] = $scope.cf.getSum(item.data,"facilityCountNONHW",false);
        	
        	item.data.sort(function(a, b) {
        		return a.iaActivityCode.localeCompare(b.iaActivityCode);
        	});
        	
        	if(item.hasOwnProperty('data')){
            	for(var j =0; j<item.data.length;j++){
            		var subItem = item.data[j];
            		
            		$scope.wasteTransferDownload[i+add_fields+(++subItems)]= new Array();
                	$scope.wasteTransferDownload[i+add_fields+subItems][0] = $scope.tr_laa[subItem.iaActivityCode];
                	$scope.wasteTransferDownload[i+add_fields+subItems][1] = $scope.cf.getSum(subItem,"quantityTotalHWIC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][2] = $scope.cf.getSum(subItem,"facilityCountHWIC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][3] = $scope.cf.getSum(subItem,"quantityTotalHWOC",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][4] = $scope.cf.getSum(subItem,"facilityCountHWOC",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][5] = $scope.cf.getSum(subItem,"quantityTotalHW",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][6] = $scope.cf.getSum(subItem,"facilityCountHW",false);
                	$scope.wasteTransferDownload[i+add_fields+subItems][7] = $scope.cf.getSum(subItem,"quantityTotalNONHW",true);
                	$scope.wasteTransferDownload[i+add_fields+subItems][8] = $scope.cf.getSum(subItem,"facilityCountNONHW",false);
                	
                	if(subItem.hasOwnProperty('sublevel') && subItem.sublevel != null){
                		subItem.sublevel.sort(function(a, b) {
                			return $scope.roman(a.iaSubActivityCode.substring(7, a.iaSubActivityCode.length-1))- $scope.roman(b.iaSubActivityCode.substring(7, b.iaSubActivityCode.length-1));
                		});

                		for(var k =0; k< subItem.sublevel.length ;k++){
                    		var subSubItem = subItem.sublevel[k];
                    		$scope.wasteTransferDownload[i+add_fields+(++subItems)]= new Array();
                        	$scope.wasteTransferDownload[i+add_fields+subItems][0] = $scope.tr_laa[subSubItem.iaSubActivityCode];
                        	$scope.wasteTransferDownload[i+add_fields+subItems][1] = $scope.cf.getSum(subSubItem,"quantityTotalHWIC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][2] = $scope.cf.getSum(subSubItem,"facilityCountHWIC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][3] = $scope.cf.getSum(subSubItem,"quantityTotalHWOC",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][4] = $scope.cf.getSum(subSubItem,"facilityCountHWOC",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][5] = $scope.cf.getSum(subSubItem,"quantityTotalHW",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][6] = $scope.cf.getSum(subSubItem,"facilityCountHW",false);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][7] = $scope.cf.getSum(subSubItem,"quantityTotalNONHW",true);
                        	$scope.wasteTransferDownload[i+add_fields+subItems][8] = $scope.cf.getSum(subSubItem,"facilityCountNONHW",false);
                		}
                	}
            	}
        	}
        	$scope.wasteTransferDownload[i+add_fields+(++subItems)]= new Array();
        	$scope.wasteTransferDownload[i+add_fields+subItems][0] = ' ';
        	
        	add_fields += subItems+1;
        }
        
        add_fields = $scope.wasteTransferDownload.length+1;

        $scope.wasteTransferDownload[add_fields]= new Array();
        $scope.wasteTransferDownload[add_fields][0] = $scope.tr_c.Total;
        $scope.wasteTransferDownload[add_fields][1] = wasteTransfer.totalHWIC;
        $scope.wasteTransferDownload[add_fields][2] = wasteTransfer.facilityCountHWIC;
        $scope.wasteTransferDownload[add_fields][3] = wasteTransfer.totalHWOC;
        $scope.wasteTransferDownload[add_fields][4] = wasteTransfer.facilityCountHWOC;
        $scope.wasteTransferDownload[add_fields][5] = wasteTransfer.totalHW;
        $scope.wasteTransferDownload[add_fields][6] = wasteTransfer.facilityCountHW;
        $scope.wasteTransferDownload[add_fields][7] = wasteTransfer.totalNONHW;
        $scope.wasteTransferDownload[add_fields][8] = wasteTransfer.facilityCountNONHW;
	}	
	
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
	
	$scope.updatePollutantDownloadData = function(itemsArray, storageArray, headerArray){
        var add_fields = 4;
        
        $scope.topInfoDownload(storageArray);
        
        storageArray[add_fields]= new Array();
        storageArray[add_fields][0] = headerArray.data[0].txt;
        var h_add_fields = 0;
        for(var i = 2; i < headerArray.data.length; i++){
        	var hItemTxt = headerArray.data[i].txt;
        	hItemTxt=hItemTxt.replace(/<\/?[^>]+(>|$)/g, "");
        	storageArray[add_fields][i-1+ h_add_fields] = hItemTxt  + '('+$scope.tr_c.Quantity+')';
        	storageArray[add_fields][i-1+ (++h_add_fields)] = hItemTxt + '('+$scope.tr_c.Facilities+')';
        }
    	add_fields += 1;
    	
    	var pritems = itemsArray.data.sort(function(a, b) {
    	    return a.key - b.key;
    	});
    	
        for(var i =0; i<pritems.length;i++){
        	var subItems = 0;
        	var item = pritems[i];
        	
        	var polqs = item.pollutantquantitys.sort(function(a, b) {
        	    return a.pollutantCode.localeCompare(b.pollutantCode);
        	});
        	
        	storageArray[i+add_fields]= new Array();
        	storageArray[i+add_fields][0] = $scope.tr_laa[item.key];
        	h_add_fields=1;
        	for(var ih =0; ih<polqs.length;ih++){
        		var polq = polqs[ih]
        		
        		storageArray[i+add_fields][ih+(h_add_fields)] = $scope.ff.formatMethod(polq[$scope.med]);
            	storageArray[i+add_fields][ih+(++h_add_fields)] = (polq[$scope.med]>0)?polq.facilities:0 ;
        	}
        	
        	item.data.sort(function(a, b) {
        		return a.iaActivityCode.localeCompare(b.iaActivityCode);
        	});
        	
        	if(item.hasOwnProperty('data')){
            	for(var j =0; j<item.data.length;j++){
            		var subItem = item.data[j];
            		
            		storageArray[i+add_fields+(++subItems)]= new Array();
                	storageArray[i+add_fields+subItems][0] = $scope.tr_laa[subItem.iaActivityCode];
                	
                	var polqs2 = subItem.pollutantquantitys.sort(function(a, b) {
                	    return a.pollutantCode.localeCompare(b.pollutantCode);
                	});
                	
                	h_add_fields=1;
                	for(var ih =0; ih<polqs2.length;ih++){
                		var polq2 = polqs2[ih]
                		
                		storageArray[i+add_fields+subItems][ih+(h_add_fields)] = $scope.ff.formatMethod(polq2[$scope.med]);
                    	storageArray[i+add_fields+subItems][ih+(++h_add_fields)] = (polq2[$scope.med]>0)?polq2.facilities:0 ;
                	}
                	
                	if(subItem.hasOwnProperty('data') && subItem.data != null){
                		subItem.data.sort(function(a, b) {
                			return $scope.roman(a.iaSubActivityCode.substring(7, a.iaSubActivityCode.length-1))- $scope.roman(b.iaSubActivityCode.substring(7, b.iaSubActivityCode.length-1));
                		});

                		for(var k =0; k< subItem.data.length ;k++){
                			var subSubItem = subItem.data[k];

                			storageArray[i+add_fields+(++subItems)]= new Array();
                			storageArray[i+add_fields+subItems][0] = $scope.tr_laa[subSubItem.iaSubActivityCode];

                			var polqs3 = subSubItem.pollutantquantitys.sort(function(a, b) {
                				return a.pollutantCode.localeCompare(b.pollutantCode);
                			});

                			h_add_fields=1;
                			for(var ih =0; ih<polqs3.length;ih++){
                				var polq3 = polqs3[ih]

                				storageArray[i+add_fields+subItems][ih+(h_add_fields)] = $scope.ff.formatMethod(polq3[$scope.med]);
                				storageArray[i+add_fields+subItems][ih+(++h_add_fields)] = (polq3[$scope.med]>0)?polq3.facilities:0 ;
                			}
                		}
                	}
            	}
        	}
        	storageArray[i+add_fields+(++subItems)]= new Array();
        	storageArray[i+add_fields+subItems][0] = ' ';
        	
        	add_fields +=subItems+1;
        }
        
        add_fields += 1 + itemsArray.data.length;

        storageArray[add_fields]= new Array();
        storageArray[add_fields][0] = $scope.tr_c.Total;
        
        var polqts = itemsArray.pttotal.sort(function(a, b) {
    	    return a.pollutantCode.localeCompare(b.pollutantCode);
    	});
    	
    	h_add_fields=1;
    	for(var ih =0; ih<polqts.length;ih++){
    		var polqt = polqts[ih]
    		
    		storageArray[add_fields][ih+(h_add_fields)] = $scope.ff.formatMethod(polqt.quantity);
        	storageArray[add_fields][ih+(++h_add_fields)] =polqt.facilities;
    	}
	}

	$scope.topInfoDownload = function(array){
		var i;
		for(i=0;i<$scope.headitms.length;i++){
			array[i]= new Array();
			array[i][0] = $scope.headitms[i].title;
			array[i][1] = $scope.headitms[i].val;
		}
		array[i]= new Array();
		array[i][0] = ' ';
	}
}])

;