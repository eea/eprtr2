'use strict';

angular.module('myApp.areaOverviewPrTab', ['restangular','ngSanitize','angularSpinner'])

   .controller('AreaOverviewPrTabCtrl', ['$scope', '$rootScope','$filter', 'Restangular',
                                       'translationService','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   $rootScope, Restangular,translationService,formatStrFactory,countFactory,usSpinnerService) {
	    $scope.beforesearch = true;
        $scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
	    $scope.prqueryparams = $scope.queryparams;
	    
	    $scope.med = 'quantityAir';

	    $scope.headeritems = [];
    	$scope.pttotal = [];
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_c = data.Common;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_ao = data.AreaOverview;
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

   /*       $rootScope.$on('us-spinner:spin', function(event, key) {
            $scope.spinneractive = true;
          });

          $rootScope.$on('us-spinner:stop', function(event, key) {
            $scope.spinneractive = false;
          });
*/
    	
        $scope.$watchCollection('[pollutant, queryparams]', function(value){
//        	if($scope.prtabfilter.pgselect && $scope.prtabfilter.pgselect.lov_PollutantID && $scope.queryparams){
           	if($scope.pollutant && $scope.queryparams){
        		//Clear collection
        	    $scope.prqueryparams = $scope.queryparams;
        		$scope.items = [];
        	    $scope.headeritems = [];
        		//get data
        		if($scope.pollutant.lov_PollutantID){
            		if(!$scope.prqueryparams.LOV_PollutantGroupID){
            			$scope.prqueryparams.LOV_PollutantGroupID = $scope.pollutant.lov_PollutantID;
            		}
            		$scope.startSpin();
        			$scope.getData();
        		}
        	}
        });

        $scope.$watch('medium', function(value){
        	if($scope.items && $scope.items.length > 0){
        		$scope.startSpin();
          		$scope.updateData();
        	}
        });
 
        $scope.getData = function(){
            $scope.beforesearch = false;
        	$scope.searchService = $scope.restconfig.all('pollutantreleaseAreaoverview');
    		$scope.searchService.getList($scope.prqueryparams).then(function(response) {
        		$scope.items = response.data;
        		$scope.resultlist = response.data;
//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
          		$scope.updateData();
    		});
        }
        
        /**
         * Activities
         */
        $scope.updateData = function()
        {
        	if($scope.items.length > 0){
        		
            	switch($scope.medium){
					case 'AIR':
						$scope.med = 'quantityAir';
						break;
					case 'WATER':
						$scope.med = 'quantityWater';
						break;
					case 'SOIL':
						$scope.med = 'quantitySoil';
						break;
					default:
						$scope.med = 'quantityAir';
						break;
	        	}
        		
	        	$scope.headeritems = [];
	        	$scope.pttotal = [];
	        	//first col:
	        	var _o = 0;
	        	var first = {'txt': $scope.tr_ao.TransfersOf + $scope.tr_lpo[$scope.pollutant.code], 'align':'text-left col-Min200 ', 'order':_o};
	        	$scope.headeritems.push(first);
	        	_o++;
	        	var second = {'txt': '', 'align':'text-left', 'order':_o};
	        	$scope.headeritems.push(second);
	        	_o++;
	        	var pollst = $scope.items[0].pollutantquantitys.sort($scope.predicatBy("pollutantCode"));
			    
	        	for (var i = 0; i < pollst.length; i++) {
		        	var polhead = {'txt': $scope.tr_lpo[pollst[i].pollutantCode+'.short'], 'align':'text-right col-Min75', 'order':_o};
		        	$scope.headeritems.push(polhead);
		        	_o++;
		        	$scope.getTotalValues(pollst[i].lov_pollutantid);
			    }
			    /* - - - */
			    
			    
		    }
        	$scope.stopSpin();
        };
        $scope.getTotalValues = function(polid){
        	var fac = 0;
        	var qua = 0;
        	var polcode = '';
        	for (var i = 0; i < $scope.items.length; i++) {
        		var act = $scope.items[i];
	        	for (var j = 0; j < act.pollutantquantitys.length; j++) {
	        		var pol = act.pollutantquantitys[j];
	        		if (pol.lov_pollutantid == polid){
	        			if(pol[$scope.med]>0){
	        				fac += pol.facilities;
	        				qua += pol[$scope.med];
	        			}
	        			if(polcode == ''){
		        			polcode = pol.pollutantCode;
	        			}
	        			continue;
	        		}
	        	}
        	}
        	$scope.pttotal.push({"facilities":fac,"quantity":qua,"pollutantCode":polcode});
        }
        
        $scope.predicatBy = function(prop){
        	   return function(a,b){
        	      if( a[prop] > b[prop]){
        	          return 1;
        	      }else if( a[prop] < b[prop] ){
        	          return -1;
        	      }
        	      return 0;
        	   }
        	}
        
   }])

   .directive('areaOverviewPrTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'AreaOverviewPrTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			visible: '=',
  			pollutant: '=',
  			medium: '=',
  			resultlist:'='
  		},
  		templateUrl: 'components/areaoverview/pr_tab.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         