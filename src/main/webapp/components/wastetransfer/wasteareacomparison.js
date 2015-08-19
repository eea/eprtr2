'use strict';

angular.module('myApp.wasteAreaComparison', ['restangular','ngSanitize','angularSpinner','myApp.eprtrgooglechart'])

   .controller('WasteAreaComparisonCtrl', ['$scope', '$filter', 'Restangular', 'translationService','formatStrFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,  translationService, formatStrFactory, usSpinnerService) {
        $scope.ff = formatStrFactory;
        $scope.wtacfilter = {};
        $scope.wtacsel = {};
        $scope.nodata = true;
        $scope.init = true;
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
    			$scope.tr_w = data.WasteTransfers;
        		$scope.tr_cl = data.ChartLabels;
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        	  });
        };
        $scope.translate();
        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

    	
    	/**
    	 * Spinner
    	 */
        $scope.startSpin = function() {
            if (!$scope.spinneractive) {
              usSpinnerService.spin('spinner-2');
              $scope.spinneractive = true;
            }
          };

          $scope.stopSpin = function() {
            if ($scope.spinneractive) {
              usSpinnerService.stop('spinner-2');
              $scope.spinneractive = false;
            }
          };
          $scope.spinneractive = false;

          $scope.$watch('wtacfilter.wtsel', function(value) {
          	if ($scope.wtacfilter && $scope.wtacfilter.wtsel ) {
//          		$scope.wtacfilter.wtsel = $scope.wtacsel.wtsel;
          		$scope.startSpin();
        		$scope.getData();
          	}
          });
          
        $scope.$watchCollection('[tr_lovwt,queryparams,visible]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_lovwt != undefined){
        		$scope.loadWTselector();
        		/*$scope.startSpin();
    			$scope.getData();*/
        	}
        });

        $scope.loadWTselector = function(){
    		if ($scope.queryparams != undefined){
    			//We don't want WasteTypeCode in query
    			var qp = {};
    		    for(var key in $scope.queryparams) {
    		        if(key != 'WasteTypeCode') {
    		        	qp[key] = $scope.queryparams[key];
    		        }
    		    }

    		    console.log('Ready to req wastetransferCounts!');
            	$scope.searchWTCService = $scope.restconfig.one('wastetransferCounts');
        		$scope.searchWTCService.get(qp).then(function(response) {
//    	            $scope.headitems = response.data;
    	            $scope.quantityNONHW = response.data.quantityNONHW;
    	            $scope.quantityHWIC = response.data.quantityHWIC;
    	            $scope.quantityHWOC = response.data.quantityHWOC;
    	            if($scope.queryparams.WasteTypeCode != undefined){
        	            $scope.wtacfilter.wtsel = $scope.queryparams.WasteTypeCode[0];//'NONHW';
    	            }
    	            else{
    	            	$scope.wtacfilter.wtsel = 'NONHW';
    	            }
        		    console.log('Received results from wastetransferCounts!');
            		$scope.getData();
    	        });
    		}
        };
        
        $scope.getData = function(){
    		/*SET WasteType*/
        	var qp = {};
		    for(var key in $scope.queryparams) {
		        if(key != 'WasteType' && key != 'WasteTypeCode') {
		        	qp[key] = $scope.queryparams[key];
		        }
		    }
		    if($scope.wtacfilter.wtsel){
		    	qp.WasteType = $scope.wtacfilter.wtsel.replace('-','');
		    }
		    //console.log('Ready to req wastetransferAreaCompare:' + qp.WasteType);
        	$scope.searchService = $scope.restconfig.all('wastetransferAreaCompare');
    		$scope.searchService.getList(qp).then(function(response) {
        		$scope.items = response.data;
    		    //console.log('Received results from wastetransferAreaCompare:' + qp.WasteType);
        		//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
          		$scope.updateAreaComparisonData();
          		$scope.nodata = (response.data.length > 0)? true:false;
    		});
        };
        
    /*    $scope.wtacsel = function(wastetype){
        	$scope.wtacfilter.wtsel = wastetype;
    		$scope.startSpin();
			$scope.getData();

        }*/
        
        $scope.updateAreaComparisonData = function() {

			var totalquantity = 0;
			var topquantity = 0;
            var graphData = [];
            
        	var gr = ($scope.queryparams.RegionSearch)?'n':'r';
        	var title = ($scope.queryparams.RegionSearch)?$scope.tr_c['Region']:$scope.tr_c['RiverBasinDistrict'];
        	if ($scope.queryparams.LOV_AreaGroupID){
        		gr = 'c';
        		title = $scope.tr_c['Country'];
        	}
        	
            for (var i = 0; i < $scope.items.length; i++) {
            	var gkey = $scope.items[i].area;
            	switch (gr) {
				case 'n':
					gkey = $scope.tr_lnr[$scope.items[i].area];
					break;
				case 'r':
					gkey = $scope.tr_lrbd[$scope.items[i].area];
					break;
				case 'c':
					gkey = $scope.tr_lco[$scope.items[i].area];
					break;
				default:
					break;
				}
                topquantity = $scope.items[i].pctTotal > topquantity? $scope.items[i].pctTotal: topquantity;
                graphData.push(
                        {c: [{v: gkey},
                        	 {v: $filter('number')($scope.items[i].pctTotalAnnexI,2)},
                             {v: $filter('number')($scope.items[i].pctTotal-$scope.items[i].pctTotalAnnexI,2)},
                        	 {v: $filter('number')($scope.items[i].pctRecoveryAnnexI,2)},
                             {v: $filter('number')($scope.items[i].pctRecovery-$scope.items[i].pctRecoveryAnnexI,2)},
                        	 {v: $filter('number')($scope.items[i].pctDisposalAnnexI,2)},
                             {v: $filter('number')($scope.items[i].pctDisposal-$scope.items[i].pctDisposalAnnexI,2)},
                             {v: $filter('number')($scope.items[i].pctUnspecAnnexI,2)},
                             {v: $filter('number')($scope.items[i].pctUnspec-$scope.items[i].pctUnspecAnnexI,2)}]}
                        );
            }
            
            /**
             * Options
             * */
            var chart1 = {};
            chart1.type = "google.charts.Bar";
            chart1.displayed = false;
            chart1.data = {};
            chart1.data.cols = [
				       {id: "n", label: title, type: "string"},
				       {id: "td", label: $scope.tr_cl["DOUBLE_COUNTING_TOTAL"], type: "number"},
				       {id: "t", label: $scope.tr_cl["TOTAL"], type: "number"},
				       {id: "dd", label: $scope.tr_cl["DISPOSAL_COUNTING_TOTAL"], type: "number"},
				       {id: "d", label: $scope.tr_cl["DISPOSAL"], type: "number"},
				       {id: "rd", label: $scope.tr_cl["RECOVERY_COUNTING_TOTAL"], type: "number"},
				       {id: "r", label: $scope.tr_cl["RECOVERY"], type: "number"},
				       {id: "ud", label: $scope.tr_cl["UNSPECIFIED_COUNTING_TOTAL"], type: "number"},
				       {id: "u", label: $scope.tr_cl["UNSPECIFIED"], type: "number"}
				   ];
  	      	    //data.addRows(graphData);
 /* 	    data.addRows([
  	        ['Denmark', 0.1, 12.4, 11.2, 9.1, 0, 1, 5, 2],
  	        ['Sweden',  2.1, 2.4, 10.4, 19.1, 0, 1, 11, 2],
  	        ['Poland',  3.4, 22.4, 5.2, 0, 0, 1, 5, 2],
  	        ['Norway',  1.1, 5.4, 6.2, 13.1, 4, 0, 5, 2]
  	    ]);*/
  			var _ticks = [0, 25, 50, 75, 100];
  			var _range = { min: 0, max: 100 };

  	        //reset
  			switch(Math.ceil(topquantity / 10) * 10) {
  		    case 100:
  		        break;
  		    case 90:
  		        break;
  		    case 80:
	  			 _ticks = [0, 20, 40, 60, 80];
  	  			 _range = { min: 0, max: 80 };
  		        break;
  		    case 70:
	  			 _ticks = [0, 20, 40, 60, 80];
  	  			 _range = { min: 0, max: 80 };
  		        break;
  		    case 60:
 	  			 _ticks = [0, 20, 40, 60];
  	  			 _range = { min: 0, max: 60 };
  		        break;
  		    case 50:
  	  			 _ticks = [0, 10, 20, 30, 40, 50];
  	  			 _range = { min: 0, max: 50 };
  		        break;
  		    case 40:
 	  			 _ticks = [0, 10, 20, 30, 40];
 	  			 _range = { min: 0, max: 40 };
 		        break;
  		    case 30:
 	  			 _ticks = [0, 10, 20, 30];
 	  			 _range = { min: 0, max: 30 };
 		        break;
  		    default:
 	  			 _ticks = [0, 10, 20, 30];
	  			 _range = { min: 0, max: 30 };
  		        break;
  			}

  			var _ts = {color: '#fff'}
  	        var options1 = {
  			  height:($scope.items.length*60)+40,
  	          isStacked: true,
  	          //tooltip:{isHtml:true},
  			  /*chart: {
  	            title: 'Company Performance',
  	            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
  	          },*/
  	          bars: 'horizontal', // Required for Material Bar Charts.
  				series: {2:{targetAxisIndex:1},3:{targetAxisIndex:1},4:{targetAxisIndex:2},5:{targetAxisIndex:2},6:{targetAxisIndex:3},7:{targetAxisIndex:3}},
  				 hAxes: [{ viewWindow: _range, ticks: _ticks ,format: '#\'%\'', textStyle:{color: 'black'}},
  						{ viewWindow: _range, ticks: _ticks ,format: '#\'%\'', textStyle:_ts },
  						{ viewWindow: _range, ticks: _ticks ,format: '#\'%\'', textStyle:_ts},
  						{ viewWindow: _range, ticks: _ticks ,format: '#\'%\'', textStyle:_ts}]
  	        };

  			chart1.data.rows = graphData;
  			chart1.options = options1;
  	        $scope.myChart = chart1;
  	        $scope.stopSpin();

  			chart1.options.width = '100%';
  	        
/*  			$scope.aooptions = options1;
            	$scope.aodata = graphData;*/
        } 

        $scope.initfix = function(){
        	if ($scope.init && $scope.myChart){
          		var chart2 = {};
          	    chart2.type = "google.charts.Bar";
                chart2.displayed = false;
                chart2.data = $scope.myChart.data;
                chart2.options = $scope.myChart.options;
                chart2.options.width = '100%';
            	$scope.myChart = chart2;
            	$scope.init = false;
        	}
        }
   
       /* var chart1 = {};
        chart1.type = "google.charts.Bar";
        chart1.displayed = false;
        chart1.data = {
          "cols": [{
            id: "month",
            label: "Month",
            type: "string"
          }, {
            id: "laptop-id",
            label: "Laptop",
            type: "number"
          }, {
            id: "desktop-id",
            label: "Desktop",
            type: "number"
          }, {
            id: "server-id",
            label: "Server",
            type: "number"
          }, {
            id: "cost-id",
            label: "Shipping",
            type: "number"
          }],
          "rows": [{c: [{v: "January"}, {v: 19, f: "42 items"}, {v: 12, f: "Ony 12 items"}, {v: 7, f: "7 servers"}, {v: 4}]}, 
    				{c: [{v: "February"}, {v: 13 }, { v: 1, f: "1 unit (Out of stock this month)"}, { v: 12}, { v: 2 }]}, 
    				{c: [{v: "March"}, {v: 24}, {v: 5}, {v: 11}, {v: 6}]}]};

        chart1.options = {
          "title": "Sales per month",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "bars":'horizontal',
          "vAxis": {
            "title": "Sales unit",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Date"
          }
        };*/

//        $scope.myChart = chart1;
      
   }])
.value('googleChartApiConfig', {
        version: '1.1',
        optionalSettings: {
          packages: ['bar'],
          language: 'en'
        }})
 .directive('wasteAreaComparison', function() {
	return {
		restrict: 'E',
		controller: 'WasteAreaComparisonCtrl',
        transclude: true,
		scope: {
			queryparams: '=',
			visible: '=',
			header: '=' 
		},
		templateUrl: 'components/wastetransfer/wasteareacomparison.html',
		link: function(scope, element, attrs){
		}
	};
});
        
