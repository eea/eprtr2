'use strict';

angular.module('myApp.hazTransboundary', ['restangular','ngSanitize','angularSpinner','myApp.eprtrgooglechart'])

   .controller('HazTransboundaryCtrl', ['$scope', '$filter', 'Restangular', 'translationService','formatStrFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,  translationService, formatStrFactory, usSpinnerService) {
        $scope.ff = formatStrFactory;
        $scope.wtfilter = {};
        $scope.nodata = true;
        //$scope.queryparams = {};
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
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

        /*  $scope.$watch('wtfilter.wtsel', function(value) {
          	if ($scope.wtfilter.wtsel) {
        		$scope.startSpin();
              	var qp = angular.copy($scope.queryparams);
             		qp.WasteType = [value.replace('-','')];
              	$scope.getData(qp);
        		$scope.getData();
          	}
          });*/
          
        $scope.$watchCollection('[tr_lovwt,queryparams]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_lovwt != undefined){
        		$scope.startSpin();
    			$scope.getData();
        	}
        });

        $scope.getData = function(){
    		/*SET WasteType*/
        	var qp = {};
		    for(var key in $scope.queryparams) {
		        //if(key != 'WasteType' && key != 'WasteTypeCode') {
		        	qp[key] = $scope.queryparams[key];
		        //}
		    }
		    
        	$scope.searchService = $scope.restconfig.all('transboundaryHazardousWaste');
    		$scope.searchService.getList(qp).then(function(response) {
        		$scope.items = response.data;
//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
          		$scope.updateHZData();
          		$scope.nodata = (response.data.length > 0)? true:false;
    		});
        };
        
        $scope.updateHZData = function() {
//			var totalquantity = 0;
            var graphData = [];
            $scope.hcountries = [];  
            $scope.vcountries = [];  
    		var vticks1 = [];
    		var hticks1 = [];
    		
    		$scope.hcountries[0] = '';
    		$scope.vcountries[0] = '';
    		vticks1[0] = 0;
       		hticks1[0] = 0;
       	    		
    		
            for (var i = 0; i < $scope.items.length; i++) {
                /*Handle Country*/
            	if($scope.hcountries.indexOf($scope.items[i].transferTo)<0){
            		$scope.hcountries.push($scope.items[i].transferTo);
            	}
            	if($scope.vcountries.indexOf($scope.items[i].transferFrom)<0){
            		$scope.vcountries.push($scope.items[i].transferFrom);
            	}
            	
            	var ito = $scope.hcountries.indexOf($scope.items[i].transferTo);
            	var ifrom = $scope.vcountries.indexOf($scope.items[i].transferFrom);

            	if(hticks1.indexOf(ito)<0){
            		hticks1.push(ito);
            	}
            	if(vticks1.indexOf(ifrom)<0){
            		vticks1.push(ifrom);
            	}
            	
            	graphData.push(
                    {c: [{v: $scope.items[i].transferFrom+'-'+$scope.items[i].transferTo},
                         {v: ito},
                    	 {v: ifrom},
                         {v: ''},
                    	 {v: Math.round($scope.items[i].quantityTotal*100)/100}]}
                    );
            }
            $scope.hcountries.push('');
            $scope.vcountries.push('');
    		vticks1.push($scope.vcountries.length-1);
       		hticks1.push($scope.hcountries.length-1);
            
            /**
             * Options
             * */

            var chart1 = {};
            chart1.type = "BubbleChart";
            chart1.displayed = false;
            chart1.data = {};
            chart1.data.cols = [
				       {id: "n", label: 'ID', type: "string"},
				       {id: "fr", label: $scope.tr_cl["FROM_COUNTRY"], type: "number"},
				       {id: "to", label: $scope.tr_cl["TO_COUNTRY"], type: "number"},
				       {id: "col", label: "", type: "string"},
				       {id: "zs", label: $scope.tr_cl["QUANTITY"], type: "number"}
				   ];

            
            
  	        /*var options1 = {
  	        	  title: 'Transboundary hazardous waste',
  	              hAxis: {title: $scope.tr_cl["FROM_COUNTRY"]},
  	              vAxis: {title: $scope.tr_cl["TO_COUNTRY"]}	
  	        };
  	        */
  	        
            var heigh = vticks1.length * 40;
            heigh = (heigh<200)?200:heigh;

  			//var _vticks1 = [0, 1, 2, 3];
  			var vrange1 = { min: 0, max: (vticks1.length-1) };
  			//var _hticks1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  			var hrange1 = { min: 0, max: (hticks1.length-1) };
  	  	        var options1 = {
  	  	        	  title: 'Transboundary hazardous waste',
  	  	              hAxis: {title: $scope.tr_cl["TO_COUNTRY"], viewWindow: hrange1, ticks: hticks1},
  	  	              vAxis: {title: $scope.tr_cl["FROM_COUNTRY"], viewWindow: vrange1, ticks: vticks1},
  					 legend: {position: 'none'},
  					 bubble: {textStyle: {color: 'none'}},
  					 height: heigh
  					 //tooltip: {trigger:'none'}
  	  	        };

  			chart1.data.rows = graphData;
  			chart1.options = options1;
  	        $scope.myChart = chart1;
  	        
    	 //Custom Tooltip
	    	//$scope.mouseX;
	    	//$scope.mouseY;
	        $(document).mousemove( function(e) {
	        	$scope.mouseX = e.pageX; 
	        	$scope.mouseY = e.pageY;
	        });
	        

	        /*
	         *  Attach the functions that handle the tool-tip pop-up
	         *  handler1 is called when the mouse moves into the bubble, and handler 2 is called when mouse moves out of bubble
	         */
	        /*google.visualization.events.addListener(chart, 'onmouseover', handler1);
	        google.visualization.events.addListener(chart, 'onmouseout', handler2);
	        */
	        
  	        
  	        $scope.stopSpin();
/*  			$scope.aooptions = options1;
            	$scope.aodata = graphData;*/
        } 
        
        $scope.fixtext = function(){
        	for ( var i = 0; i < $scope.vcountries.length ; i ++ ){
		        $('#bubblechart_wt svg text[text-anchor="end"]:contains("'+i+'")').text(function(j,t){
		            if (t == i){
		            if (i >= $scope.vcountries.length || i < 1){
		                return " ";
		            }
		            return $scope.vcountries[i];
		            }
		        });
	        }
    		//Change labels on horizontal axis
    		 for ( var i = 0; i < $scope.hcountries.length ; i ++ ){
    			$('#bubblechart_wt svg text[text-anchor="middle"]:contains("'+i+'")').text(function(j,t){
    				if (t == i){
    					if (i >= $scope.hcountries.length || i < 1){
    						return " ";
    					}
    					return $scope.hcountries[i];
    				}
    			});
		    }	
  	    	  
        }
        
		/*
         * These functions handle the custom tooltip display
         */
        $scope.handler1 = function(e){
            var x = $scope.mouseX;
            var y = $scope.mouseY - 130;
            var a = 1;
            var b = 2;
            $('#custom_tooltip').html('<div>Value of A is'+a+' and value of B is'+b+'</div>').css({'top':y,'left':x}).fadeIn('slow');
        }
        $scope.handler2 = function(e){
            $('#custom_tooltip').fadeOut('fast');
        }

      
   }])
.value('googleChartApiConfig', {
        version: '1.1',
        optionalSettings: {
          packages: ['corechart'],
          language: 'en'
        }})
 .directive('hazTransboundary', function() {
	return {
		restrict: 'E',
		controller: 'HazTransboundaryCtrl',
        transclude: true,
		scope: {
			queryparams: '=' 
		},
		templateUrl: 'components/wastetransfer/haztransboundary.html',
		link: function(scope, element, attrs){
		}
	};
});
        
