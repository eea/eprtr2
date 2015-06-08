'use strict';

angular.module('myApp.areaOverviewPtTab', ['restangular','ngSanitize'])

   .controller('AreaOverviewPtTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', 'countFactory', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory,countFactory) {
        //$scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
	    $scope.prfilter = {};// .polsearch
	    $scope.prfilter.pgselect = {};
	    $scope.prfilter.pselect = {};
	    //        $scope.queryParams = {};
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_c = data.Common;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
       	  });
        };
        $scope.translate();
        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        $scope.$watchCollection('[prfilter.pgselect, queryparams]', function(value){
        	if($scope.prfilter.pgselect && $scope.prfilter.pgselect.lov_PollutantID && $scope.queryparams){
        		//Clear collection
        		$scope.items = [];
        		//get data
        	}
        });

        $scope.$watchCollection('[prfilter.pselect, queryparams]', function(value){
        	if($scope.prfilter.pselect && $scope.prfilter.pselect.lov_PollutantID && $scope.queryparams){
        		//Clear collection
        		$scope.items = [];
        		//get data
        	}
        });
    	
        $scope.$watchCollection('[tr_c,queryparams,visible]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_lpo != undefined && $scope.visible ){
                
        		//Clear collection
        		$scope.items = [];
        		//get data
        		$scope.getData();
        	}
        });

        $scope.getData = function(){
        }
        
        
        /**
         * Activities
         */
        $scope.updateData = function()
        {
        };

        
   }])

   .directive('areaOverviewPtTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'AreaOverviewPtTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			visible: '='
  		},
  		templateUrl: 'components/areaoverview/pt_tab.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         