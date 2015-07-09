'use strict';

angular.module('myApp.areaOverviewPtTab', ['restangular','ngSanitize','angularSpinner'])

   .controller('AreaOverviewPtTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory,countFactory, usSpinnerService) {
	    $scope.beforesearch = true;
        $scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
/*	    $scope.prfilter = {};// .polsearch
	    $scope.prfilter.pgselect = {};
	*/    
	    $scope.headeritems = [];
//	    $scope.prfilter.pselect = {};
	    //        $scope.queryParams = {};
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

        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        $scope.$watchCollection('[pollutant, queryparams]', function(value){
//        	if($scope.prfilter.pgselect && $scope.prfilter.pgselect.lov_PollutantID && $scope.queryparams){
           	if($scope.pollutant && $scope.queryparams){
        		//Clear collection
        		$scope.items = [];
        		//get data
        		if($scope.pollutant.lov_PollutantID){
        			$scope.startSpin();
        			$scope.getData();
        		}
        	}
        });

        $scope.getData = function(){
            $scope.beforesearch = false;
        	$scope.searchService = $scope.restconfig.all('pollutanttransferAreaoverview');
    		$scope.searchService.getList($scope.queryparams).then(function(response) {
        		$scope.items = response.data;
        		$scope.resultlist = response.data;
//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
        		$scope.startSpin();
          		$scope.updateData();

    		});
        }
        
        /**
         * Activities
         */
        $scope.updateData = function()
        {
        	if($scope.items.length > 0){
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
	        			fac += pol.facilities;
	        			qua += pol.quantity;
	        			polcode = pol.pollutantCode;
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

   .directive('areaOverviewPtTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'AreaOverviewPtTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			visible: '=',
  			pollutant: '=',
  			resultlist: '=',
  			headeritems: '=',
  			pttotal: '='
  		},
  		templateUrl: 'components/areaoverview/pt_tab.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         