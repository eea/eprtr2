'use strict';

angular.module('myApp.hazTransboundary', ['restangular','ngSanitize','angularSpinner','myApp.eprtrgooglechart'])

   .controller('HazTransboundaryCtrl', ['$scope', '$filter', 'Restangular', 'translationService','formatStrFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,  translationService, formatStrFactory, usSpinnerService) {
        $scope.ff = formatStrFactory;
        $scope.wtfilter = {};
        $scope.nodata = true;
        $scope.coords = {};
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

  		/*
           * These functions handle the custom tooltip display
           */
          $(document).mousemove(function(e) {
        	  $scope.coords = $scope.getCrossBrowserElementCoords(e);
        	  /*mouseX = e.pageX;
        	    mouseY = e.pageY;*/
          });
        	    
        	    
          $scope.onThisMouseMove = function ($event) {
        	  //ng-mousemove="onThisMouseMove($event)"
        	  $scope.coords = $scope.getCrossBrowserElementCoords($event);
          };

          $scope.myhandler1 = function(value){
        	  var item = $scope.items[value];
              var myhtml = '<div class="panel panel-default"><div class="panel-body" style="padding:5px 5px 5px 5px;"><table ><tr><td class="fdTitles">';
              myhtml += $scope.tr_c['Year'] + '</td><td class="text-right" style="min-width:100px;">' + item.reportingYear + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_cl['FROM'] + '</td><td class="text-right">' + $scope.tr_lco[item.transferFrom] + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_cl['TO'] + '</td><td class="text-right">' + $scope.tr_lco[item.transferTo] + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_cl['FACILITIES'] + '</td><td class="text-right">' + item.facilities + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_c['Total'] + '</td><td class="text-right">' + $scope.ff.formatMethod(item.quantityTotal,false) + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_c['Recovery'] + '</td><td class="text-right">' + $scope.ff.formatMethod(item.quantityRecovery,false) + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_c['Disposal'] + '</td><td class="text-right">' + $scope.ff.formatMethod(item.quantityDisposal,false) + '</td></tr><tr><td class="fdTitles">';
              myhtml += $scope.tr_c['Unspecified'] + '</td><td class="text-right">' + $scope.ff.formatMethod(item.quantityUnspec,false) + '</td></tr></table>';
              //myhtml += '<p>x: '+$scope.coords.x+' y:'+$scope.coords.y+' ox: '+$scope.coords.ox+' oy:'+$scope.coords.oy+'</p>';
              myhtml += '</div></div>';
              
              $('#custom_tooltip').html(myhtml).css({'top':$scope.coords.y-50,'left':$scope.coords.x}).fadeIn('slow');
          };
          $scope.myhandler2 = function(value){
              $('#custom_tooltip').fadeOut('fast');
          };

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
          		$scope.haztransboundaryitems = $scope.items;
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
				       {id: "to", label: $scope.tr_cl["TO_COUNTRY"], type: "number"},
				       {id: "fr", label: $scope.tr_cl["FROM_COUNTRY"], type: "number"},
				       {id: "col", label: "", type: "string"},
				       {id: "zs", label: $scope.tr_cl["QUANTITY"], type: "number"}
				   ];
            
            var heigh = vticks1.length * 30;
            heigh = (heigh<200)?200:heigh;

  			//var _vticks1 = [0, 1, 2, 3];
  			var vrange1 = { min: 0, max: (vticks1.length-1) };
  			//var _hticks1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  			var hrange1 = { min: 0, max: (hticks1.length-1) };
  	  	        var options1 = {
  	  	        	  title: 'Transboundary hazardous waste',
  	  	              hAxis: {title: $scope.tr_cl["TO_COUNTRY"], viewWindow: hrange1, ticks: hticks1, textStyle:{fontSize: 12}},
  	  	              vAxis: {title: $scope.tr_cl["FROM_COUNTRY"], viewWindow: vrange1, ticks: vticks1},
  					 legend: {position: 'none'},
  					 bubble: {textStyle: {color: 'none'}},
  					 height: heigh, 
  					 width: '100%',
					 tooltip: {trigger:'none'},
					 chartArea: {top: 10, height: '75%',left: 70, width: '80%'}
  					 //tooltip: {trigger:'none'}
  	  	        };

  			chart1.data.rows = graphData;
  			chart1.options = options1;
  	        $scope.myChart = chart1;
  	        
  	        $scope.stopSpin();
        }; 
        
        $scope.fixtext = function(value){
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
  	    	  
        };
        
        $scope.getCrossBrowserElementCoords = function (mouseEvent)
        {
          var result = {
            x: 0,
            y: 0,
            ox: 0,
            oy: 0
          };

          if (!mouseEvent)
          {
            mouseEvent = window.event;
          }

          if (mouseEvent.pageX || mouseEvent.pageY)
          {
            result.x = mouseEvent.pageX;
            result.y = mouseEvent.pageY;
          }
          else if (mouseEvent.clientX || mouseEvent.clientY)
          {
            result.x = mouseEvent.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
            result.y = mouseEvent.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
          }

          if (mouseEvent.target)
          {
            var offEl = mouseEvent.target;
            var offX = 0;
            var offY = 0;

            if (typeof(offEl.offsetParent) != "undefined")
            {
              while (offEl)
              {
                offX += offEl.offsetLeft;
                offY += offEl.offsetTop;

                offEl = offEl.offsetParent;
              }
            }
            else
            {
              offX = offEl.x;
              offY = offEl.y;
            }

            result.ox = offX;
            result.oy = offY;
            result.x -= offX;
            result.y -= offY;
          }

          return result;
        };

        
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
			queryparams: '=',
			haztransboundaryitems:'='
		},
		templateUrl: 'components/wastetransfer/haztransboundary.html',
		link: function(scope, element, attrs){
		}
	};
});
        
