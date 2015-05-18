'use strict';

angular.module('myApp.timeseries', ['ngRoute','restangular','ngSanitize', 'googlechart'])

.constant('tsconf',{
	colors:{
		'ColorAirTotal':'#93adcd',
		'ColorAirAccidental':'#7E94AF',
		'ColorAirBothYears':'#b3b3b3',
		'ColorWaterTotal':'#c6d4aa',
		'ColorWaterAccidental':'#A9B592',
		'ColorWaterBothYears':'#b3b3b3',
		'ColorSoilTotal':'#d5b9a4',
		'ColorSoilAccidental':'#B69E8C',
		'ColorSoilBothYears':'#b3b3b3',
		'ColorWasteWater':'#C7D5AB',
		'ColorWasteWaterBothYears':'#b3b3b3',
		'ColorWasteTotal':'#bebebe',
		'ColorWasteRecovery':'#c6d4aa',
		'ColorWasteDisposal':'#d6baa5',			
		'ColorWasteUnspec':'#C6EBF7',
		'ColorWasteBothYears':'#b3b3b3'}
})

.controller('TimeseriesController', 
		['$scope', '$http', '$filter', 'Restangular', 'tsconf', 'translationService', 'formatStrFactory', 'lovPollutantType','lovCountryType', 
		 'lovAreaGroupType', 'lovNutsRegionType', 'riverBasinDistrictsType', 'annexIActivityType', 'naceActivityType', 'reportingYearsType',
          function($scope, $http, $filter, Restangular, tsconf, translationService, formatStrFactory, lovPollutantType, lovCountryType, 
        		  lovAreaGroupType, lovNutsRegionType, riverBasinDistrictsType, annexIActivityType, naceActivityType, reportingYearsType ) {

/**		
 * Basic parameters
 * */
	$scope.ConfidentialityExplanation = '';
	$scope.headitms = [];
	$scope.showalert = false;
	$scope.showGroup = false;
	$scope.base = {};
	$scope.filter = {}
	$scope.fFactory = formatStrFactory;
	//DATA
	$scope.tscoll = [];
	
	$scope.prselcoll = [];
	$scope.wtselcoll = []; //NONHW, HWIC, HWOC
	
	$scope.prconfcoll = [];
	$scope.ptconfcoll = [];
	$scope.wtconfcoll = [];
	
	$scope.reportingyears = {};
	$scope.tscompare = {};

	/*GOOGLE CHART*/
    $scope.tsStackseriesObject = {};
    $scope.tsStackseriesObject.type = 'ColumnChart';
    $scope.tsStackseriesObject.formatters = {};
    $scope.tsStackseriesObject.options = {
    		"tooltip": {"isHtml": true},
    		"focusTarget": "category",
    		"legend":{position: 'bottom', maxLines: 3, alignment:'start' },
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true
        };

    $scope.tsStackCompareObject = {};
    $scope.tsStackCompareObject.type = 'ColumnChart';
    $scope.tsStackCompareObject.formatters = {};
    $scope.tsStackCompareObject.options = {
    		"tooltip": {"isHtml": true},
    		"focusTarget": "category",
    		"legend":{position: 'bottom', maxLines: 3, alignment:'start' },
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true
        };

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
    
    /* ReportingYears*/
    reportingYearsType.getList().then(function(data) {
    	$scope.reportingyears = data;
    	$scope.tscompare.selectedStartYear = $scope.reportingyears[0];
		$scope.tscompare.selectedEndYear = $scope.reportingyears[$scope.reportingyears.length -1]; 
		 /*if(!$scope.showalert && data.confidentialIndicator != undefined){
			 $scope.showalert = data.confidentialIndicator;
		 }*/
	});

/*
 * Load translation resources 
 * */        
//		Requesting text and title resources 
	translationService.get().then(function (data) {
		$scope.tr_f = data.Facility;
		$scope.tr_c = data.Common;
		$scope.tr_t = data.Timeseries;
		$scope.tr_p = data.Pollutant;
		$scope.tr_w = data.WasteTransfers;
		$scope.tr_lcf = data.LOV_CONFIDENTIALITY;
		$scope.tr_lag = data.LOV_AREAGROUP;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_lco = data.LOV_COUNTRY;
		$scope.tr_la = data.Activity;
		$scope.tr_lna = data.LOV_NACEACTIVITY;
		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
		$scope.tr_lp = data.LOV_POLLUTANT;
		$scope.tr_lm = data.LOV_MEDIUM;
		$scope.tr_lwt = data.LOV_WASTETYPE;
		$scope.tr_lu = data.LOV_UNIT;
	    /*Maybe wrong place*/
		$scope.tsStackseriesObject.options["vAxis"] = {"title": $scope.tr_lu['KGM']};
		
    });

	
		/**
		 * events
		 */
	/*Initial load*/
	$scope.$watchCollection('[content,queryParams,tr_c]', function(value) {
		if($scope.tr_c != undefined){
		    /*Header input*/
			$scope.createheader();
			//Is Confident
			$scope.isConfidental();
	        /**
	         * Set prtr scope
	         */
			switch($scope.content){
				case 'pollutantrelease': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantReleases;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPR1;
					if ($scope.queryParams.MediumCode != undefined){
						$scope.filter.prsel = $scope.queryParams.MediumCode[0];
						if ($scope.queryParams.MediumCode.length > 1){
							$scope.reqPollutantReleaseRBHeader();
						}
					}
					//Request Pollutant Release Timeseries data
					$scope.reqPollutantReleaseSeriesData();
					break;

				case 'pollutanttransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPT1;
					//Request data
					$scope.reqPollutantTransferSeriesData();
					break;

				case 'wastetransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.WasteTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationWT1;
					if ($scope.queryParams.WasteTypeCode != undefined){

						for (var i=0; i< $scope.queryParams.WasteTypeCode.length; i++) {
							$scope.queryParams.WasteTypeCode[i] = $scope.queryParams.WasteTypeCode[i].replace("-","");
						};				
						$scope.filter.wtsel = $scope.queryParams.WasteTypeCode[0];
						if ($scope.queryParams.WasteTypeCode.length > 1){
							$scope.reqWasteTransferRBHeader();
						}
					}
					//$scope.filter.wtsel = 'NONHW';
					//Request data
					//$scope.reqWasteTransferSeriesData();
					break;
			}
		}
	});

	
    /*Pollutant Release Timeseries*/
    $scope.$watchCollection('[tscoll,filter.prsel,active]', function(value){
    	if($scope.content == 'pollutantrelease' && $scope.tscoll != undefined && $scope.tscoll.length > 0 && $scope.active.timeseries != undefined ){
			$scope.setPRTScoll();
    	}
    });
    /*Pollutant Transfer Timeseries*/
    $scope.$watchCollection('[tscoll,active]', function(value){
    	if($scope.content == 'pollutanttransfer' && $scope.tscoll != undefined && $scope.tscoll.length > 0 && $scope.active.timeseries != undefined ){
			$scope.setPTTScoll();
    	}
    });
    /*Waste Transfer Timeseries*/
    $scope.$watchCollection('[filter.wtsel,active]', function(value){
    	if($scope.content == 'wastetransfer' && $scope.active.timeseries != undefined ){
    		$scope.reqWasteTransferSeriesData();
    	}
    });
    /*Pollutant Release Compare*/
    $scope.$watchCollection('[reportingyears,tscompare.selectedStartYear,tscompare.selectedEndYear,filter.prsel,active]', function(value){
    	if($scope.content == 'pollutantrelease' && $scope.reportingyears != undefined && $scope.active.comparison != undefined ){
			$scope.reqPollutantReleaseCompareData();
    	}
    });
    /*Pollutant Transfer Compare*/
    $scope.$watchCollection('[reportingyears,tscompare.selectedStartYear,tscompare.selectedEndYear,active]', function(value){
    	if($scope.content == 'pollutanttransfer' && $scope.reportingyears != undefined && $scope.active.comparison != undefined ){
			$scope.reqPollutantTransferCompareData();
    	}
    });
    /*Waste Transfer Compare*/
    $scope.$watchCollection('[reportingyears,tscompare.selectedStartYear,tscompare.selectedEndYear,filter.wtsel,active]', function(value){
    	if($scope.content == 'wastetransfer' && $scope.reportingyears != undefined && $scope.active.comparison != undefined ){
			$scope.reqWasteTransferCompareData();
    	}
    });
    /*Waste Transfer confidentiality*/
    $scope.$watchCollection('[filter.wtsel,active]', function(value){
    	if($scope.content == 'wastetransfer' && $scope.active.confidentiality != undefined ){
			$scope.reqWasteTransferConfidentialityData();
    	}
    });
    /*Pollutant Transfer confidentiality*/
    $scope.$watchCollection('[showalert,active]', function(value){
    	if($scope.content == 'pollutanttransfer' && $scope.active.confidentiality != undefined  && $scope.showalert ){
			$scope.reqPollutantTransferConfidentialityData();
    	}
    });
    /*Pollutant Release confidentiality*/
    $scope.$watchCollection('[showalert,active,filter.prsel,]', function(value){
    	if($scope.content == 'pollutantrelease' && $scope.active.confidentiality != undefined  && $scope.showalert ){
			$scope.reqPollutantReleaseConfidentialityData();
    	}
    });
    
	/**
	 * Show Confidental indicator 
	 * */
    $scope.isConfidental = function(){
		if (_.keys($scope.queryParams).length > 0){
			var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
			var isconfservice = null;
			switch($scope.content){
				case 'pollutantrelease': 
					isconfservice = rest.one('pollutantreleaseIsConfidential');
				break;
	
				case 'pollutanttransfer': 
					isconfservice = rest.one('pollutanttransferIsConfidential');
					break;
	
				case 'wastetransfer': 
					isconfservice = rest.one('wastetransferIsConfidential');
					break;
			}
			isconfservice.get($scope.queryParams).then(function(response) {
	            $scope.showalert = (response.data === 'true');
	        });
		}    	
    };
		
	/**
	 * REQUEST Data 
	 * */
	//Pollutantrelease Medium Selector Titles
	$scope.reqPollutantReleaseRBHeader = function(){
		if (_.keys($scope.queryParams).length > 0){
			/*pollutantreleaseSearch just to get the header ?*/
/*			var qp = {};
		    for(var key in $scope.queryParams) {
	        	qp[key] = $scope.queryParams[key];
		    }*/
			var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantSearchCounts = rest.one('pollutantreleasecounts');
	        pollutantSearchCounts.get($scope.queryParams).then(function(response) {
//	            $scope.headitems = response.data;
	            $scope.quantityAir = response.data.quantityAir;
	            $scope.quantityWater = response.data.quantityWater;
	            $scope.quantitySoil = response.data.quantitySoil;
	        });
		}
	};

	//Waste Transfer WasteTransferCode Selector Titles
	$scope.reqWasteTransferRBHeader = function(){
		if (_.keys($scope.queryParams).length > 0){
			var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var wastetransferSearchCounts = rest.one('wastetransferCounts');
	        wastetransferSearchCounts.get($scope.queryParams).then(function(response) {
//	            $scope.headitems = response.data;
	            $scope.quantityNONHW = response.data.quantityNONHW;
	            $scope.quantityHWIC = response.data.quantityHWIC;
	            $scope.quantityHWOC = response.data.quantityHWOC;
	        });
		}
	};
	
	
	
	$scope.reqPollutantReleaseSeriesData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//Create new qparams
			$scope.tscoll = [];
			var _coll = [];
			var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'MediumCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantSeriesSearch = rest.all('pollutantreleaseSeries');
	        pollutantSeriesSearch.getList(qp).then(function(response) {
				for (var i = 0; i < $scope.reportingyears.length; i++){
					var _y = $scope.reportingyears[i].year;
					var _ts = null;
					for (var j = 0; j < response.data.length; j++){
						if(response.data[j].reportingYear == _y){
							_ts = response.data[j];
						}
					}
					if (_ts == null){
						_ts = {"reportingYear":_y,"facilities":0,"countries":0,"quantityAir":null,"accidentalAir":null,"quantityWater":null,"accidentalWater":null,"quantitySoil":null,"accidentalSoil":null};
					}
					_coll.push(_ts);
				}
	        	//$scope.tscoll = response.data;
				$scope.tscoll = _coll;
				//$scope.setPRTScoll();
	        });
		}
	};

	$scope.reqPollutantTransferSeriesData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//Create new qparams
			$scope.tscoll = [];
			var _coll = [];
			var qp = {};
		    for(var key in $scope.queryParams) {
		        if(key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantSeriesSearch = rest.all('pollutanttransferSeries');
	        pollutantSeriesSearch.getList(qp).then(function(response) {
				for (var i = 0; i < $scope.reportingyears.length; i++){
					var _y = $scope.reportingyears[i].year;
					var _ts = null;
					for (var j = 0; j < response.data.length; j++){
						if(response.data[j].reportingYear == _y){
							_ts = response.data[j];
						}
					}
					if (_ts == null){
						_ts = {"reportingYear":_y,"facilities":0,"countries":0,"quantity":null};
					}
					_coll.push(_ts);
				}
	        	//$scope.tscoll = response.data;
				$scope.tscoll = _coll;
				//$scope.setPRTScoll();
	        });
		}
	};

	$scope.reqWasteTransferSeriesData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//Create new qparams
			$scope.tscoll = [];
			var _coll = [];
			var qp = {};
			var qp = {};
			qp.WasteType = $scope.filter.wtsel;
		    for(var key in $scope.queryParams) {
		        if(key != 'WasteTypeCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var wastetransferSeriesSearch = rest.all('wastetransferSeries');
	        wastetransferSeriesSearch.getList(qp).then(function(response) {
				for (var i = 0; i < $scope.reportingyears.length; i++){
					var _y = $scope.reportingyears[i].year;
					var _ts = null;
					for (var j = 0; j < response.data.length; j++){
						if(response.data[j].reportingYear == _y){
							_ts = response.data[j];
						}
					}
					if (_ts == null){
						_ts = {"reportingYear":_y,"facilities":0,"wasteType":$scope.filter.wtsel,"countries":0,"quantityTotal":null,"quantityRecovery":null,"quantityDisposal":null,"quantityUnspec":null}
					}
					_ts.reportingYear = _ts.reportingYear;
					_coll.push(_ts);
				}
	        	//$scope.tscoll = response.data;
				$scope.tscoll = _coll;
		        //Prepare data and show
	    		$scope.setWTTScoll();
	        });
		}
		
	};
	/**
	 * Request Pollutant Release Compare data
	 */
	$scope.reqPollutantReleaseCompareData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.tscompare.data = [];

			//Create new qparams
			var qp = {};
			qp.ReportingYearStart = $scope.tscompare.selectedStartYear.year;
			qp.ReportingYearEnd = $scope.tscompare.selectedEndYear.year;
			qp.Medium = $scope.filter.prsel;

			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'MediumCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantCompareSearch = rest.all('pollutantreleasecompare');
	        pollutantCompareSearch.getList(qp).then(function(response) {
				$scope.tscompare.data = response.data;
				$scope.setPRCPcoll();
				$scope.setPRCPtabcoll();
	        });
		}
	};
	
	/**
	 * Request Pollutant Release Compare data
	 */
	$scope.reqPollutantTransferCompareData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.tscompare.data = [];

			//Create new qparams
			var qp = {};
			qp.ReportingYearStart = $scope.tscompare.selectedStartYear.year;
			qp.ReportingYearEnd = $scope.tscompare.selectedEndYear.year;
			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'MediumCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantCompareSearch = rest.all('pollutanttransferCompare');
	        pollutantCompareSearch.getList(qp).then(function(response) {
				$scope.tscompare.data = response.data;
				$scope.setPTCPcoll();
				$scope.setPTCPtabcoll();
	        });
		}
	};
	
	/**
	 * Request Waste Transfer Compare data
	 */
	$scope.reqWasteTransferCompareData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.tscompare.data = [];

			//Create new qparams
			var qp = {};
			qp.ReportingYearStart = $scope.tscompare.selectedStartYear.year;
			qp.ReportingYearEnd = $scope.tscompare.selectedEndYear.year;
			qp.WasteType = $scope.filter.wtsel;

			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'WasteTypeCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantCompareSearch = rest.all('wastetransferCompare');
	        pollutantCompareSearch.getList(qp).then(function(response) {
				$scope.tscompare.data = response.data;
				$scope.setWTCPcoll();
				$scope.setWTCPtabcoll();
	        });
		}
	};

	$scope.reqWasteTransferConfidentialityData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.wtconfcoll = [];

			//Create new qparams
			var qp = {};
			qp.WasteType = $scope.filter.wtsel;

			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'WasteTypeCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var wastetransferConfidential = rest.all('wastetransferConfidentialTS');
	        wastetransferConfidential.getList(qp).then(function(response) {
				$scope.wtconfcoll = response.data;
				//$scope.setWTCOcoll();
				//$scope.setWTCOtabcoll();
	        });
		}
		
	};

	$scope.reqPollutantTransferConfidentialityData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.ptconfcoll = [];

			//Create new qparams
			var qp = {};

			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var wastetransferConfidential = rest.all('pollutanttransferConfidentialityTS');
	        wastetransferConfidential.getList(qp).then(function(response) {
				$scope.ptconfcoll = response.data;
	        });
		}
		
	};
	$scope.reqPollutantReleaseConfidentialityData = function(){
		if (_.keys($scope.queryParams).length > 0){
			//$scope.tscoll = [];
			$scope.prconfcoll = [];

			//Create new qparams
			var qp = {};
			qp.Medium = $scope.filter.prsel;

			/*Filter Query parameters*/
		    for(var key in $scope.queryParams) {
		        if(key != 'MediumCode' && key != 'ReportingYear') {
		        	qp[key] = $scope.queryParams[key];
		        }
		    }
//	        qp['MediumCode'] = $scope.filter.prsel;
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var wastetransferConfidential = rest.all('pollutantreleaseConfidentialityTS');
	        wastetransferConfidential.getList(qp).then(function(response) {
				$scope.prconfcoll = response.data;
	        });
		}
		
	};	
	/**
	 * 
	 * FORMAT AND PREPARE DATA
	 * 
	 */
	/*Pollutant Release Timeseries*/
	$scope.setPRTScoll = function(){
		if ($scope.tscoll.length > 0){
			/*Column Bar*/
			$scope.tsStackseriesObject.data = {"cols": [
	              {id: "y", label: "Reporting year", type: "string"},
	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
	              {id: "a", label: $scope.tr_p['AccidentalQuantity'], type: "number"},
	              {id: "q", label: $scope.tr_p['Quantity'], type: "number"}
	        ]};
			var colors = [];
			if ($scope.filter.prsel == 'AIR'){
				colors = [tsconf.colors.ColorAirTotal,tsconf.colors.ColorAirAccidental];
			}
			else if ($scope.filter.prsel == 'WATER'){
				colors = [tsconf.colors.ColorWaterTotal,tsconf.colors.ColorWaterAccidental];
			}
			else if ($scope.filter.prsel == 'SOIL'){
				colors = [tsconf.colors.ColorSoilTotal,tsconf.colors.ColorSoilAccidental];
			}
			$scope.tsStackseriesObject.options.colors = colors;
			
			var rows = [];
			for (var i = 0; i < $scope.tscoll.length; i++){
				var ts = $scope.tscoll[i];
				if ($scope.filter.prsel == 'AIR'){
					ts.quantity = ts.quantityAir;
					ts.quantityAccidental = ts.accidentalAir;
				}
				else if ($scope.filter.prsel == 'WATER'){
					ts.quantity = ts.quantityWater;
					ts.quantityAccidental = ts.accidentalWater;
				}
				else if ($scope.filter.prsel == 'SOIL'){
					ts.quantity = ts.quantitySoil;
					ts.quantityAccidental = ts.accidentalSoil;
				}
				/*Calculate accidental Percentage*/
				if (ts.quantityAccidental > 0){
					ts.accidentalPercent = $scope.fFactory.DeterminePercent(ts.quantity, ts.quantityAccidental );
					ts.tsquantity = parseFloat(ts.quantity) - parseFloat(ts.quantityAccidental);
				}
				else{
					ts.accidentalPercent = 0;
					ts.tsquantity = ts.quantity;
				}
				var tip = $scope.formatPRTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantityAccidental})
				row.push({v: ts.tsquantity})
				rows.push({c: row});
	
			}
			$scope.tsStackseriesObject.data["rows"] = rows;
		}
	};

	/*Pollutant Release Timeseries*/
	$scope.setPTTScoll = function(){
		if ($scope.tscoll.length > 0){
			/*Column Bar*/
			$scope.tsStackseriesObject.data = {"cols": [
	              {id: "y", label: "Reporting year", type: "string"},
	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
	              {id: "q", label: $scope.tr_p['Quantity'], type: "number"}
	        ]};
			$scope.tsStackseriesObject.options.colors = [tsconf.colors.ColorWasteTotal];
			
			var rows = [];
			for (var i = 0; i < $scope.tscoll.length; i++){
				var ts = $scope.tscoll[i];
				var tip = $scope.formatPTTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantity})
				rows.push({c: row});
			}
			$scope.tsStackseriesObject.data["rows"] = rows;
		}
	}
	
	/*Waste Transfer Timeseries*/
	$scope.setWTTScoll = function(){
		if ($scope.tscoll.length > 0){
			//Need to group by year
			/*Column Bar*/
			$scope.tsStackseriesObject.data = {"cols": [
	              {id: "y", label: "Reporting year", type: "string"},
	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
	              {id: "r", label: $scope.tr_c['TreatmentRecovery'], type: "number"}, 
	              {id: "d", label: $scope.tr_c['TreatmentDisposal'], type: "number"}, 
	              {id: "u", label: $scope.tr_c['TreatmentUnspecified'], type: "number"} 
	        ]};

			$scope.tsStackseriesObject.options.colors = [tsconf.colors.ColorWasteRecovery,tsconf.colors.ColorWasteDisposal,tsconf.colors.ColorWasteUnspec];
	
			var rows = [];
			for (var i = 0; i < $scope.tscoll.length; i++){
				var ts = $scope.tscoll[i];
				/*Calculate accidental Percentage*/
				var tip = $scope.formatWTTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantityRecovery != null ? ts.quantityRecovery:0 });
				row.push({v: ts.quantityDisposal != null ? ts.quantityDisposal:0 });
				row.push({v:  ts.quantityUnspec != null ? ts.quantityUnspec:0 });
				rows.push({c: row});
	
			}
			$scope.tsStackseriesObject.data["rows"] = rows;
		}
	}

	
	
	/*Pollutant Release Compare data for Chart*/
	$scope.setPRCPcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			//tsStackCompareObject
			$scope.tsStackCompareObject.data = {"cols": [
			                          	              {id: "y", label: "Reporting year", type: "string"},
			                          	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
			                          	              {id: "a", label: $scope.tr_c['FacilitiesBothYears'], type: "number"},
			                          	              {id: "q", label: $scope.tr_c['AllFacilities'], type: "number"}
			                          	        ]};
			var colors = [];
			if ($scope.filter.prsel == 'AIR'){
				colors = [tsconf.colors.ColorAirTotal,tsconf.colors.ColorAirAccidental];
			}
			else if ($scope.filter.prsel == 'WATER'){
				colors = [tsconf.colors.ColorWaterTotal,tsconf.colors.ColorWaterAccidental];
			}
			else if ($scope.filter.prsel == 'SOIL'){
				colors = [tsconf.colors.ColorSoilTotal,tsconf.colors.ColorSoilAccidental];
			}
			$scope.tsStackCompareObject.options.colors = colors;
			
			//var simple = {};
			var rows = [];
			for (var i = 0; i < $scope.tscompare.data.length; i++){
				var ts = $scope.tscompare.data[i];
				//var k = ts.reportingYear;
				/*Calculate accidental Percentage*/
				if (ts.quantityBoth > 0){
					ts.bothPercent = $scope.fFactory.DeterminePercent(ts.quantityAll, ts.quantityBoth );
					ts.compquantityall = parseFloat(ts.quantityAll) - parseFloat(ts.quantityBoth);
				}
				else{
					ts.bothPercent = 0;
					ts.compquantityall = ts.quantityAll;
				}
				var tip = $scope.formatPCTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantityBoth})
				row.push({v: ts.compquantityall})
				rows.push({c: row});
	
			}
			$scope.tsStackCompareObject.data["rows"] = rows;

		}
	};
	
	/*Pollutant Transfer Compare data for Chart*/
	$scope.setPTCPcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			//tsStackCompareObject
			$scope.tsStackCompareObject.data = {"cols": [
			                          	              {id: "y", label: "Reporting year", type: "string"},
			                          	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
			                          	              {id: "a", label: $scope.tr_c['FacilitiesBothYears'], type: "number"},
			                          	              {id: "q", label: $scope.tr_c['AllFacilities'], type: "number"}
			                          	        ]};

			$scope.tsStackCompareObject.options.colors = [tsconf.colors.ColorWasteTotal,tsconf.colors.ColorWasteWaterBothYears];
			var rows = [];
			for (var i = 0; i < $scope.tscompare.data.length; i++){
				var ts = $scope.tscompare.data[i];

				/*Calculate accidental Percentage*/
				if (ts.quantityBoth > 0){
					ts.bothPercent = $scope.fFactory.DeterminePercent(ts.quantityAll, ts.quantityBoth );
					ts.compquantityall = parseFloat(ts.quantityAll) - parseFloat(ts.quantityBoth);
				}
				else{
					ts.bothPercent = 0;
					ts.compquantityall = ts.quantityAll;
				}
				var tip = $scope.formatPCTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantityBoth})
				row.push({v: ts.compquantityall})
				rows.push({c: row});
	
			}
			$scope.tsStackCompareObject.data["rows"] = rows;

		}
	};

	/*Pollutant Release Compare data for Chart*/
	$scope.setWTCPcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			//tsStackCompareObject
			$scope.tsStackCompareObject.data = {"cols": [
			                          	              {id: "y", label: "Reporting year", type: "string"},
			                          	              {id: "t", type: "string", role: "tooltip", p: {html: true}},
			                          	              {id: "a", label: $scope.tr_c['FacilitiesBothYears'], type: "number"},
			                          	              {id: "q", label: $scope.tr_c['AllFacilities'], type: "number"}
			                          	        ]};
			$scope.tsStackCompareObject.options.colors = [tsconf.colors.ColorWasteTotal,tsconf.colors.ColorWasteBothYears];
			
			var rows = [];
			for (var i = 0; i < $scope.tscompare.data.length; i++){
				var ts = $scope.tscompare.data[i];
				ts.quantityAll = ts.quantityTotalAll; 
				ts.quantityBoth  = ts.quantityTotalBoth;

				/*Calculate accidental Percentage*/
				if (ts.quantityBoth > 0){
					ts.bothPercent = $scope.fFactory.DeterminePercent(ts.quantityTotalAll, ts.quantityTotalBoth );
					ts.compquantityall = parseFloat(ts.quantityTotalAll) - parseFloat(ts.quantityTotalBoth);
				}
				else{
					ts.bothPercent = 0;
					ts.compquantityall = ts.quantityTotalAll;
				}
				var tip = $scope.formatPCTooltip(ts);
				var row = [{v: ts.reportingYear},{v: tip}];
				row.push({v: ts.quantityTotalBoth})
				row.push({v: ts.compquantityall})
				rows.push({c: row});
	
			}
			$scope.tsStackCompareObject.data["rows"] = rows;

		}
	};

	
	/*Pollutant Release Compare data for Tables*/
	$scope.setPRCPtabcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			$scope.tscompare.alldata = [];
			$scope.tscompare.bothdata = [];
			var y1 = $scope.tscompare.data[0];
			var y2 = $scope.tscompare.data[1];
			/*ALL*/
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityAll != null ? $scope.fFactory.formatMethod(y1.quantityAll,false):'-', 
						'col2':y2.quantityAll != null ? $scope.fFactory.formatMethod(y2.quantityAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Accidental'], 
						'col1':y1.accidentalAll != null ? $scope.fFactory.formatMethod(y1.accidentalAll,false):'-', 
						'col2':y2.accidentalAll != null ? $scope.fFactory.formatMethod(y2.accidentalAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1':$filter('number')(y1.facilitiesAll), 
						'col2':$filter('number')(y2.facilitiesAll)});
			/*BOTH*/
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityBoth != null ? $scope.fFactory.formatMethod(y1.quantityBoth,false):'-', 
						'col2':y2.quantityBoth != null ? $scope.fFactory.formatMethod(y2.quantityBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Accidental'], 
						'col1':y1.accidentalBoth != null ? $scope.fFactory.formatMethod(y1.accidentalBoth,false):'-', 
						'col2':y2.accidentalBoth != null ? $scope.fFactory.formatMethod(y2.accidentalBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1': $filter('number')(y1.facilitiesBoth), 
						'col2':$filter('number')(y2.facilitiesBoth)});
		};
	};

	/*Pollutant Release Compare data for Tables*/
	$scope.setPTCPtabcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			$scope.tscompare.alldata = [];
			$scope.tscompare.bothdata = [];
			var y1 = $scope.tscompare.data[0];
			var y2 = $scope.tscompare.data[1];
			/*ALL*/
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityAll != null ? $scope.fFactory.formatMethod(y1.quantityAll,false):'-', 
						'col2':y2.quantityAll != null ? $scope.fFactory.formatMethod(y2.quantityAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1':$filter('number')(y1.facilitiesAll), 
						'col2':$filter('number')(y2.facilitiesAll)});
			/*BOTH*/
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityBoth != null ? $scope.fFactory.formatMethod(y1.quantityBoth,false):'-', 
						'col2':y2.quantityBoth != null ? $scope.fFactory.formatMethod(y2.quantityBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1': $filter('number')(y1.facilitiesBoth), 
						'col2':$filter('number')(y2.facilitiesBoth)});
		};
	};

	/*Pollutant Release Compare data for Tables*/
	$scope.setWTCPtabcoll = function(){
		if ($scope.tscompare.data != undefined && $scope.tscompare.data.length > 0){
			$scope.tscompare.alldata = [];
			$scope.tscompare.bothdata = [];
			var y1 = $scope.tscompare.data[0];
			var y2 = $scope.tscompare.data[1];
			/*ALL*/
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityTotalAll != null ? $scope.fFactory.formatMethod(y1.quantityTotalAll,false):'-', 
						'col2':y2.quantityTotalAll != null ? $scope.fFactory.formatMethod(y2.quantityTotalAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Recovery'], 
						'col1':y1.quantityRecoveryAll != null ? $scope.fFactory.formatMethod(y1.quantityRecoveryAll,false):'-', 
						'col2':y2.quantityRecoveryAll != null ? $scope.fFactory.formatMethod(y2.quantityRecoveryAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Disposal'], 
						'col1':y1.quantityDisposalAll != null ? $scope.fFactory.formatMethod(y1.quantityDisposalAll,false):'-', 
						'col2':y2.quantityDisposalAll != null ? $scope.fFactory.formatMethod(y2.quantityDisposalAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Unspecified'], 
						'col1':y1.quantityUnspecAll != null ? $scope.fFactory.formatMethod(y1.quantityUnspecAll,false):'-', 
						'col2':y2.quantityUnspecAll != null ? $scope.fFactory.formatMethod(y2.quantityUnspecAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1':$filter('number')(y1.facilitiesAll), 
						'col2':$filter('number')(y2.facilitiesAll)});
			/*BOTH*/
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityTotalBoth != null ? $scope.fFactory.formatMethod(y1.quantityTotalBoth,false):'-', 
						'col2':y2.quantityTotalBoth != null ? $scope.fFactory.formatMethod(y2.quantityTotalBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Recovery'], 
						'col1':y1.quantityRecoveryBoth != null ? $scope.fFactory.formatMethod(y1.quantityRecoveryBoth,false):'-', 
						'col2':y2.quantityRecoveryBoth != null ? $scope.fFactory.formatMethod(y2.quantityRecoveryBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Disposal'], 
						'col1':y1.quantityDisposalBoth != null ? $scope.fFactory.formatMethod(y1.quantityDisposalBoth,false):'-', 
						'col2':y2.quantityDisposalBoth != null ? $scope.fFactory.formatMethod(y2.quantityDisposalBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Unspecified'], 
						'col1':y1.quantityUnspecBoth != null ? $scope.fFactory.formatMethod(y1.quantityUnspecBoth,false):'-', 
						'col2':y2.quantityUnspecBoth != null ? $scope.fFactory.formatMethod(y2.quantityUnspecBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1': $filter('number')(y1.facilitiesBoth), 
						'col2':$filter('number')(y2.facilitiesBoth)});
		};
	};
	
	/**
	 * TOOLTIP Formatting
	 */
	/*Pollutant Release Timeseries Chart*/
	$scope.formatPRTooltip = function(item){
		var html = '<div style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Facilities'] + '</td><td class="text-right">' + $filter('number')(item.facilities) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesTotal'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantity,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesAccidentalReleases'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityAccidental,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesAccidentalPercentValue'] + '</td><td class="text-right">' + item.accidentalPercent  + '</td></tr></table></div>';
		return html;
	};
	/*Pollutant Transfer Timeseries Chart*/
	$scope.formatPTTooltip = function(item){
		var html = '<div style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Facilities'] + '</td><td class="text-right">' + $filter('number')(item.facilities) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesTotal'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantity,false)  + '</td></tr></table></div>';
		return html;
	};
	/*Pollutant Release Compare Chart*/
	$scope.formatPCTooltip = function(item){
		var html = '<div style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['AllFacilities'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityAll,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['FacilitiesBothYears'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityBoth,false) + '</td></tr><tr><td class="fdTitles">';
		html += 'Percentage of reporting in both years' + '</td><td class="text-right">' + item.bothPercent  + '</td></tr></table></div>';
		return html;
	};
	/*Pollutant Release Compare Chart*/
	$scope.formatWTTooltip = function(item){
		var html = '<div style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Total'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityTotal,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Recovery'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityRecovery,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Disposal'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityDisposal,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Unspecified'] + '</td><td class="text-right">' + $scope.fFactory.formatMethod(item.quantityUnspec,false) + '</td></tr></table></div>';
		return html;
	};


	
	
	
	/**
	 * CREATE HEADER
	 * */
	$scope.createheader = function(){
		$scope.headitms = [];
		/* HEADER PART FOR AREA*/
		var area = {'order':0,	'clss':'fdTitles', 'title':$scope.tr_c.Area};
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
		/* HEADER PART FOR */
		/*Industrial Activity*/
		var act = {'order':1, 'clss':'fdTitles'};
		act.val = $scope.tr_c["AllSectors"];
        if ($scope.queryParams.LOV_NACESubActivityID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACESubActivityID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_NACEActivityID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACEActivityID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_NACESectorID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACESectorID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        }
        else if ($scope.queryParams.LOV_IASubActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_IASubActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_IAActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_IAActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_IASectorID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_IASectorID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        }

		/* HEADER PART FOR */
		/*Pollutant*/
	    if ($scope.content == 'pollutantrelease' || $scope.content == 'pollutanttransfer'){
			var pol = {'order':2, 'clss':'fdTitles'};
			pol.title = $scope.tr_c["Pollutant"];
			pol.val = $scope.tr_c["AllPollutants"];
			if ($scope.queryParams.LOV_PollutantGroupID)
	        {
				lovPollutantType.getByID($scope.queryParams.LOV_PollutantGroupID).get().then(function(data) {
					// returns pollutant object 
					$scope.base.pollutant = data;
					pol.val = $scope.tr_lp[data.code];
					$scope.headitms.push(pol);
				});
	        }
	        else if ($scope.queryParams.LOV_PollutantID)
	        {
				lovPollutantType.getByID($scope.queryParams.LOV_PollutantID).get().then(function(data) {
					// returns pollutant object 
					$scope.base.pollutant = data;
					pol.val = $scope.tr_lp[data.code];
					$scope.headitms.push(pol);
					if(data.parentID != null){
						// We use the pollutant.ParentID.Value for requesting parent pollutant
						// We use the parent pollutant.Code for $scope.base.parentCode
						$scope.showGroup = true;
						lovPollutantType.getByID(data.parentID).get().then(function(parentdata) {
							$scope.base.parentpollutant = parentdata;
						});
					}
				});
	        }
			//Releases to
		    if ($scope.queryParams.MediumCode != undefined){
				var rel = {'order':3, 'clss':'fdTitles'};
				rel.title = $scope.tr_c["ReleasesTo"];
				rel.val = $scope.tr_c["AllPollutants"];
				var med = [];
				for (var i=0; i< $scope.queryParams.MediumCode.length; i++) {
					var m = $scope.queryParams.MediumCode[i];
		    		if (m != 'WASTEWATER'){
		    			med.push($scope.tr_lm[m]);
		    		}
		    	}
		    	if (med.length > 0){
			    	rel.val = med.join(", ");
					$scope.headitms.push(rel);
		    	}
				if($scope.queryParams.MediumCode.indexOf('WASTEWATER') >-1){
					rel = {'order':4, 'clss':'fdTitles'};
					rel.title = $scope.tr_c["TransfersTo"];
					rel.val = $scope.tr_lm["WASTEWATER"];
					$scope.headitms.push(rel);
				}
		    }
		  //Accidental
		    if ($scope.queryParams.Accidental != undefined && $scope.queryParams.Accidental == 1){
				var acc = {'order':5, 'clss':'fdTitles'};
				acc.title = $scope.tr_c["AccidentalOnly"];
				acc.val = $scope.tr_c["Yes"];
				$scope.headitms.push(acc);
		    }
	    }
	    else if ($scope.content == 'wastetransfer'){
			//Waste type
		    if ($scope.queryParams.WasteTypeCode != undefined){
				var wast = {'order':6, 'clss':'fdTitles'};
				wast.title = $scope.tr_c["WasteTransfers"];
				var wt = [];
				for (var i=0; i< $scope.queryParams.WasteTypeCode.length; i++) {
					var w = $scope.queryParams.WasteTypeCode[i];
		    		if (w != 'HW'){
		    			wt.push($scope.tr_lwt[w]);
		    		}
		    	}
		    	if (wt.length > 0){
		    		wast.val = wt.join(", ");
					$scope.headitms.push(wast);
		    	}
		    }
	    }
		/* HEADER PART FOR */
	    /*FACILITY & ADRESS*/
	};
		
/** 
 * CONFIDENTIALITY
 * */		
		
		/*P*/
		/*We need to group the returned data by year:
		 .GroupBy(p => p.ReportingYear)
		 We order by pollutant
         .OrderBy(p => p.Key)
         
                                            .Select(x => new {
                                                Year = x.Key, 
                                                Quantity = x.Sum(p => p.Quantity), 
                                                Facilities = x.Count()}).ToList();
		 
		 
	       this.Year = year;
           this.QuantityPollutant = quantityPollutant;
           this.QuantityConfidential = quantityConfidential;
           this.UnitPollutant = CODE_KG;
           this.UnitConfidential = CODE_KG;
           */
		
}])


/**
 * Factories
 * */
.factory('lovPollutantType', ['lovPollutantService', function(lovPollutantService) {
        return {
        	getByID : function(id) {
                return lovPollutantService.one(id);
            }
        };
    }])

.factory('lovCountryType', ['lovCountryService', function(lovCountryService) {
        return {
        	getByID : function(id) {
                return lovCountryService.one(id);
            }
        };
    }])

.factory('lovAreaGroupType', ['lovAreaGroupService', function(lovAreaGroupService) {
    return {
    	getByID : function(id) {
            return lovAreaGroupService.one(id);
        }
    };
}])

.factory('lovNutsRegionType', ['lovNutsRegionService', function(lovNutsRegionService) {
    return {
    	getByID : function(id) {
            return lovNutsRegionService.one(id);
        }
    };
}])

.factory('riverBasinDistrictsType', ['riverBasinDistrictsService', function(riverBasinDistrictsService) {
    return {
    	getByID : function(id) {
            return riverBasinDistrictsService.one(id);
        }
    };
}])

.factory('reportingYearsType', ['reportingYearsService', function(reportingYearsService) {
    return {
    	getList : function() {
            return reportingYearsService.getList();
        }
    };
}])
    
/**
 * SERVICES
 * **/
.service('lovPollutantService', ['Restangular', function(Restangular){
    var lovPollutant = Restangular.service('pollutant');

    Restangular.extendModel('pollutant', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovPollutant;
}])

.service('lovCountryService', ['Restangular', function(Restangular){
    var lovCountry = Restangular.service('lovCountry');

    Restangular.extendModel('lovCountry', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovCountry;
}])

.service('lovAreaGroupService', ['Restangular', function(Restangular){
    var lovAreaGroup = Restangular.service('lovAreaGroup');

    Restangular.extendModel('lovAreaGroup', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovAreaGroup;
}])

.service('lovNutsRegionService', ['Restangular', function(Restangular){
    var lovNutsRegion = Restangular.service('nutsRegion');

    Restangular.extendModel('nutsRegion', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovNutsRegion;
}])

.service('riverBasinDistrictsService', ['Restangular', function(Restangular){
    var riverBasinDistricts = Restangular.service('riverBasinDistricts');

    Restangular.extendModel('riverBasinDistricts', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return riverBasinDistricts;
}])

.service('reportingYearsService', ['Restangular', function(Restangular){
    var reportingYears = Restangular.service('reportingYears');

    Restangular.extendModel('reportingYears', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return reportingYears;
}])
  .controller('ModalTimeSeriesCtrl', function ($scope, $modalInstance, isoContType, isoQP) {
  $scope.isoContType = isoContType;
  $scope.isoQP = isoQP;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
/*
 * This directive enables us to define this module as a custom HTML element
 *  
 * You can use only one of these parameters: 
 * */
.directive('timeseries', function() {
	return {
		restrict: 'E',
		controller: 'TimeseriesController',
        transclude: true,
		scope: {
			content: '=content', /*[pollutantrelease,pollutanttransfer,wastetransfer]*/
			queryParams: '=queryParams' /* Filter needs to include area, activity, [pollutant, medium, wastetype ]/  */
		},
		templateUrl: 'components/timeseries/timeseries.html',
		link: function(scope, element, attrs){
			scope.$watch('queryParams', function(value) {
				/*JAVA Enum cannot handle the character - so NON-HW is converted into NONHW*/
				if (scope.queryParams.WasteTypeCode != undefined){
					for (var i=0; i< scope.queryParams.WasteTypeCode.length; i++) {
						scope.queryParams.WasteTypeCode[i] = scope.queryParams.WasteTypeCode[i].replace("-","");
					}				
				}
			});
		}
	};
});
