'use strict';

angular.module('myApp.areaOverviewWasteTab', ['restangular','ngSanitize','angularSpinner'])

   .controller('AreaOverviewWasteTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'eprtrcms','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,eprtrcms,formatStrFactory,countFactory, usSpinnerService) {
	    $scope.beforesearch = true;
	    $scope.cf = countFactory;
        //$scope.queryParams = {};

//    	Requesting text and title resources 
    	eprtrcms.get('Common',null).then(function (data) {
    		$scope.tr_c = data;
    	});
    	eprtrcms.get('WasteTransfers',null).then(function (data) {
    		$scope.tr_wt = data;
    	});
    	eprtrcms.get('LOV_ANNEXIACTIVITY',null).then(function (data) {
    		$scope.tr_laa = data;
    	});
        $scope.showTable = false;
        
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

        $scope.$watchCollection('[tr_c,queryparams]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_wt != undefined){
                
        		//Clear collection
        		$scope.items = [];
        		//get data
        		$scope.startSpin();
        		$scope.getData();
        	}
        });

        $scope.getData = function(){
            $scope.beforesearch = false;
        	$scope.searchService = $scope.restconfig.all('wastetransferSearch');
    		var params = angular.copy($scope.queryparams);
    		params.SearchType = "ACTIVITIES";

    		$scope.searchService.getList(params).then(function(response) {
        		$scope.items = response.data;
//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
          		$scope.updateData();
    		});
        }
        
        
        /**
         * Activities
         */
        $scope.updateData = function()
        {
        	$scope.activities = angular.copy($scope.items);
        	$scope.resultlist = {};
        	$scope.resultlist = $scope.activities;
          	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"facilityCount",true);
        	$scope.totalHWIC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWIC",true);
        	$scope.totalHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC",true);
        	$scope.totalHW = $scope.cf.getSubSum($scope.activities,"quantityTotalHW",true);
        	$scope.totalNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW",true);

        	$scope.facilityCountHWIC = $scope.cf.getSubSum($scope.activities,"facilityCountHWIC",false);
        	$scope.facilityCountHWOC = $scope.cf.getSubSum($scope.activities,"facilityCountHWOC",false);
        	$scope.facilityCountHW = $scope.cf.getSubSum($scope.activities,"facilityCountHW",false);
        	$scope.facilityCountNONHW = $scope.cf.getSubSum($scope.activities,"facilityCountNONHW",false);
        	
        	$scope.resultlist.totalactivitiesfac = $scope.totalactivitiesfac;
        	$scope.resultlist.totalHWIC = $scope.totalHWIC;
        	$scope.resultlist.totalHWOC = $scope.totalHWOC;
        	$scope.resultlist.totalHW = $scope.totalHW;
        	$scope.resultlist.totalNONHW = $scope.totalNONHW;

        	$scope.resultlist.facilityCountHWIC = $scope.facilityCountHWIC;
        	$scope.resultlist.facilityCountHWOC = $scope.facilityCountHWOC;
        	$scope.resultlist.facilityCountHW = $scope.facilityCountHW;
        	$scope.resultlist.facilityCountNONHW = $scope.facilityCountNONHW;
        	
        	$scope.showTable = true;
        	$scope.stopSpin();
        };
   }])

   .directive('areaOverviewWasteTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'AreaOverviewWasteTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			resultlist:'='
  		},
  		templateUrl: 'components/areaoverview/wt_tab.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         