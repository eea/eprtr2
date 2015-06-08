'use strict';

angular.module('myApp.areaOverviewWasteTab', ['restangular','ngSanitize'])

   .controller('AreaOverviewWasteTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', 'countFactory', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory,countFactory) {
        //$scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
        //$scope.queryParams = {};
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_c = data.Common;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
/*        		$scope.tr_f = data.Facility;
 *        		$scope.tr_lovwt = data.LOV_WASTETYPE;
 				$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
*/        	  });
        };
        $scope.translate();
        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        $scope.$watchCollection('[tr_c,queryparams,visible]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_wt != undefined && $scope.visible ){
                
        		//Clear collection
        		$scope.items = [];
        		//get data
        		$scope.getData();
        	}
        });

        $scope.getData = function(){

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
          	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"facilityCount",true);
        	$scope.totalHWIC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWIC",true);
        	$scope.totalHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC",true);
        	$scope.totalHW = $scope.cf.getSubSum($scope.activities,"quantityTotalHW",true);
        	$scope.totalNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW",true);

        	$scope.facilityCountHWIC = $scope.cf.getSubSum($scope.activities,"facilityCountHWIC",false);
        	$scope.facilityCountHWOC = $scope.cf.getSubSum($scope.activities,"facilityCountHWOC",false);
        	$scope.facilityCountHW = $scope.cf.getSubSum($scope.activities,"facilityCountHW",false);
        	$scope.facilityCountNONHW = $scope.cf.getSubSum($scope.activities,"facilityCountNONHW",false);

        };

        
   }])

   .directive('areaOverviewWasteTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'AreaOverviewWasteTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			visible: '='
  			
  		},
  		templateUrl: 'components/areaoverview/wt_tab.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         