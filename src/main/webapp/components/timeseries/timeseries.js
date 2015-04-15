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
					$scope.reqPollutantReleaseData();
					break;

				case 'pollutanttransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPT1;
					//$scope.filter.prsel ="air";
					//Request data
					break;

				case 'wastetransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.WasteTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationWT1;
					$scope.filter.wtsel = 'nonhw';
					//Request data
					break;
			}
		}
	});

	
	
	
	$scope.$watch('filter.wtsel', function(value) {
    	//Wastetransfer hazard type changed
        /*if ($scope.items) {
            $scope.updateSummaryData();
        }*/
    });

    /*Pollutant Release Timeseries*/
    $scope.$watchCollection('[tscoll,filter.prsel,active]', function(value){
    	if($scope.tscoll != undefined && $scope.tscoll.length > 0 && $scope.active.timeseries != undefined ){
			$scope.setPRTScoll();
    	}
    });
    /*Pollutant Release Compare*/
    $scope.$watchCollection('[reportingyears,tscompare.selectedStartYear,tscompare.selectedEndYear,filter.prsel,active]', function(value){
    	if($scope.reportingyears != undefined && $scope.active.comparison != undefined ){
			$scope.reqPollutantReleaseCompareData();
    	}
    });
        
		
		
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
	
	$scope.reqPollutantReleaseData = function(){
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
						if(response.data[j].releaseYear == _y){
							_ts = response.data[j];
						}
					}
					if (_ts == null){
						_ts = {"releaseYear":_y,"facilities":0,"countries":0,"quantityAir":null,"accidentalAir":null,"quantityWater":null,"accidentalWater":null,"quantitySoil":null,"accidentalSoil":null};
					}
					_coll.push(_ts);
				}
	        	//$scope.tscoll = response.data;
				$scope.tscoll = _coll;
				//$scope.setPRTScoll();
	        });
		}
	};
	
	/*
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
	 * 
	 * FORMAT AND PREPARE DATA
	 * 
	 */
	/*Pollutant Release Timeseries*/
	$scope.setPRTScoll = function(){
		if ($scope.tscoll.length > 0){
			//Need to group by year
			var simple = {};
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
			else if ($scope.filter.prsel == 'LAND'){
				colors = [tsconf.colors.ColorSoilTotal,tsconf.colors.ColorSoilAccidental];
			}
			$scope.tsStackseriesObject.options.colors = colors;
	
			
			var rows = [];
			for (var i = 0; i < $scope.tscoll.length; i++){
				var ts = $scope.tscoll[i];
				var k = ts.releaseYear;
				simple[k] = ts;
				if ($scope.filter.prsel == 'AIR'){
					simple[k].quantity = ts.quantityAir;
					simple[k].quantityAccidental = ts.accidentalAir;
				}
				else if ($scope.filter.prsel == 'WATER'){
					simple[k].quantity = ts.quantityWater;
					simple[k].quantityAccidental = ts.accidentalWater;
				}
				else if ($scope.filter.prsel == 'LAND'){
					simple[k].quantity = ts.quantitySoil;
					simple[k].quantityAccidental = ts.accidentalSoil;
				}
				/*Calculate accidental Percentage*/
				if (simple[k].quantityAccidental > 0){
					simple[k].accidentalPercent = formatStrFactory.DeterminePercent(simple[k].quantity, simple[k].quantityAccidental );
					simple[k].tsquantity = parseFloat(simple[k].quantity) - parseFloat(simple[k].quantityAccidental);
				}
				else{
					simple[k].accidentalPercent = 0;
					simple[k].tsquantity = simple[k].quantity;
				}
				var tip = $scope.formatPRTooltip(simple[k]);
				var row = [{v: k},{v: tip}];
				row.push({v: simple[k].quantityAccidental})
				row.push({v: simple[k].tsquantity})
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
			else if ($scope.filter.prsel == 'LAND'){
				colors = [tsconf.colors.ColorSoilTotal,tsconf.colors.ColorSoilAccidental];
			}
			$scope.tsStackCompareObject.options.colors = colors;
			
			var simple = {};
			var rows = [];
			for (var i = 0; i < $scope.tscompare.data.length; i++){
				var ts = $scope.tscompare.data[i];
				var k = ts.reportingYear;
				simple[k] = ts;

				/*Calculate accidental Percentage*/
				if (simple[k].quantityBoth > 0){
					simple[k].bothPercent = formatStrFactory.DeterminePercent(simple[k].quantityAll, simple[k].quantityBoth );
					simple[k].compquantityall = parseFloat(simple[k].quantityAll) - parseFloat(simple[k].quantityBoth);
				}
				else{
					simple[k].bothPercent = 0;
					simple[k].compquantityall = simple[k].quantityAll;
				}
				var tip = $scope.formatPRCTooltip(simple[k]);
				var row = [{v: k},{v: tip}];
				row.push({v: simple[k].quantityBoth})
				row.push({v: simple[k].compquantityall})
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
						'col1':y1.quantityAll != null ? formatStrFactory.formatMethod(y1.quantityAll,false):'-', 
						'col2':y2.quantityAll != null ? formatStrFactory.formatMethod(y2.quantityAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Accidental'], 
						'col1':y1.accidentalAll != null ? formatStrFactory.formatMethod(y1.accidentalAll,false):'-', 
						'col2':y2.accidentalAll != null ? formatStrFactory.formatMethod(y2.accidentalAll,false):'-'});
			$scope.tscompare.alldata.push(
					{'title':$scope.tr_c['Facilities'], 
						'col1':$filter('number')(y1.facilitiesAll), 
						'col2':$filter('number')(y2.facilitiesAll)});
			/*BOTH*/
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Total'], 
						'col1':y1.quantityBoth != null ? formatStrFactory.formatMethod(y1.quantityBoth,false):'-', 
						'col2':y2.quantityBoth != null ? formatStrFactory.formatMethod(y2.quantityBoth,false):'-'});
			$scope.tscompare.bothdata.push(
					{'title':$scope.tr_c['Accidental'], 
						'col1':y1.accidentalBoth != null ? formatStrFactory.formatMethod(y1.accidentalBoth,false):'-', 
						'col2':y2.accidentalBoth != null ? formatStrFactory.formatMethod(y2.accidentalBoth,false):'-'});
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
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.releaseYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['Facilities'] + '</td><td class="text-right">' + $filter('number')(item.facilities) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesTotal'] + '</td><td class="text-right">' + formatStrFactory.formatMethod(item.quantity,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesAccidentalReleases'] + '</td><td class="text-right">' + formatStrFactory.formatMethod(item.quantityAccidental,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_p['ReleasesAccidentalPercentValue'] + '</td><td class="text-right">' + item.accidentalPercent  + '</td></tr></table></div>';
		return html;
	}
	/*Pollutant Release Compare Chart*/
	$scope.formatPRCTooltip = function(item){
		var html = '<div style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
		html += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['AllFacilities'] + '</td><td class="text-right">' + formatStrFactory.formatMethod(item.quantityAll,false) + '</td></tr><tr><td class="fdTitles">';
		html += $scope.tr_c['FacilitiesBothYears'] + '</td><td class="text-right">' + formatStrFactory.formatMethod(item.quantityBoth,false) + '</td></tr><tr><td class="fdTitles">';
		html += 'Percentage of reporting in both years' + '</td><td class="text-right">' + item.bothPercent  + '</td></tr></table></div>';
		return html;
	}


	
	
	
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
        else if ($scope.queryParams.LOV_AISubActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AISubActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_AIActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AIActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_AISectorID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AISectorID).get().then(function(data) {
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

	
	
		//GetTimeSeries(PollutantReleasesTimeSeriesFilter filter, MediumFilter.Medium medium) -->
		//	GetTimeSeries([AreaFilter,PeriodFilter,PollutantFilter,MediumFilter,ActivityFilter], MediumFilter.Medium medium)
		//GetTimeSeries(int facilityid, string pollutantCode, MediumFilter.Medium medium)

	//Pollutanttransfer
		//GetTimeSeries([AreaFilter,PeriodFilter,PollutantFilter,ActivityFilter])
		/*
		 db.POLLUTANTTRANSFERs.Where(lambda).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key).Select(x => new {
                                                Year = x.Key, 
                                                Quantity = x.Sum(p => p.Quantity), 
                                                Facilities = x.Count()}).ToList();
         Facility.GetReportingCountries(filter.AreaFilter).ToList(); and then clone   
         return res.OrderBy(p => p.Year).ToList();                                   
		 */
		//GetTimeSeries(int facilityid, string pollutantCode)
		/*
		db.POLLUTANTTRANSFERs.Where(f => f.FacilityID == facilityid && f.PollutantCode == pollutantCode).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key)
                 .Select(x => new TimeSeriesClasses.PollutantTransfers(x.Key, x.Sum(p => p.Quantity)));
        return data.ToList();
		 */
		
		
		//WasteTransfer
		//GetTimeSeries(WasteTransferTimeSeriesFilter filter, WasteTypeFilter.Type wastetype) -->
		//  GetTimeSeries([AreaFilter,PeriodFilter,ActivityFilter,WasteTypeFilter,WasteTreatmentFilter], WasteTypeFilter.Type wastetype)
		/*
           db.WASTETRANSFERs.Where(lambda).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key);
           switch (wastetype)
            {
                case HazardousCountry:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.HazardousCountry, x.Sum(p => p.QuantityTotalHWIC), x.Sum(p => p.QuantityRecoveryHWIC), x.Sum(p => p.QuantityDisposalHWIC), x.Sum(p => p.QuantityUnspecHWIC)));
                case HazardousTransboundary:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.HazardousTransboundary, x.Sum(p => p.QuantityTotalHWOC), x.Sum(p => p.QuantityRecoveryHWOC), x.Sum(p => p.QuantityDisposalHWOC), x.Sum(p => p.QuantityUnspecHWOC)));
                case NonHazardous:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.NonHazardous, x.Sum(p => p.QuantityTotalNONHW), x.Sum(p => p.QuantityRecoveryNONHW), x.Sum(p => p.QuantityDisposalNONHW), x.Sum(p => p.QuantityUnspecNONHW)));
                default:
                    throw new ArgumentOutOfRangeException("wastetype", String.Format("Illegal wastetype: {0}", wastetype.ToString()));
            }
            then add no of reporting countries
            Facility.GetReportingCountries(filter.AreaFilter).ToList();
			l.Year, l.Facilities, l.WasteType, l.QuantityTotal, l.QuantityRecovery, l.QuantityDisposal, l.QuantityUnspec, r.Countries
		 * */
		

		
		
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
		 * */
	   /*    this.Year = year;
           this.QuantityPollutant = quantityPollutant;
           this.QuantityConfidential = quantityConfidential;
           this.UnitPollutant = CODE_KG;
           this.UnitConfidential = CODE_KG;*/
		
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
			content: '@', /*[pollutantrelease,pollutanttransfer,wastetransfer]*/
			queryParams: '=queryParams', /* Filter needs to include area, activity, [pollutant, medium, wastetype ]/  */
			year: '@'
		},
		templateUrl: 'components/timeseries/timeseries.html',
		link: function(scope, element, attrs){
/*			scope.$watchCollection('[frid, fid, year]', function() {
				console.log('FacilityReportID changed:' + scope.frid);
	        	//scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);*/
		}
	};
});
