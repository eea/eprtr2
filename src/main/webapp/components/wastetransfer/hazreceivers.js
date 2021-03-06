'use strict';

angular.module('myApp.HazReceiversWasteTab', ['restangular','ngSanitize','angularSpinner','myApp.HazReceiversTreatmentTab'])

   .controller('HazReceiversWasteTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'eprtrcms','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,eprtrcms,formatStrFactory,countFactory, usSpinnerService) {
        $scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
	    $scope.items = [];
	    //$scope.header = {};
	    //$scope.queryParams = {};
           
//		Requesting text and title resources 
    	eprtrcms.get('Facility',null).then(function (data) {
    		$scope.tr_f = data;
    	});
    	eprtrcms.get('Common',null).then(function (data) {
    		$scope.tr_c = data;
    	});
    	eprtrcms.get('WasteTransfers',null).then(function (data) {
    		$scope.tr_wt = data;
    	});
    	eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
    		$scope.tr_lco = data;
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
        	if($scope.queryparams != undefined && $scope.tr_wt != undefined && $scope.queryparams.ReportingYear !== -1){
                
        		//Clear collection
        		$scope.items = [];
        		//get data
        		$scope.startSpin();
        		$scope.getData();
        	}
        });

        $scope.getData = function(){

        	$scope.searchService = $scope.restconfig.all('wastetransferReceivingcountry');
    		var params = angular.copy($scope.queryparams);

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
        	/*
        	 * {"reportingYear":2011,"facilities":19,"recievingCountryCode":"BE","quantityTotal":1543.501,"quantityRecovery":1543.403,"quantityDisposal":0.098,"quantityUnspec":null,"quantityCommonUnit":null,"showAsLink":true}
        	 * */
        	/*
        	$scope.activities = angular.copy($scope.items);
          	$scope.totalactivitiesfac = $scope.cf.getSubSum($scope.activities,"facilityCount",true);
        	$scope.totalHWIC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWIC",true);
        	$scope.totalHWOC = $scope.cf.getSubSum($scope.activities,"quantityTotalHWOC",true);
        	$scope.totalHW = $scope.cf.getSubSum($scope.activities,"quantityTotalHW",true);
        	$scope.totalNONHW = $scope.cf.getSubSum($scope.activities,"quantityTotalNONHW",true);

        	$scope.facilityCountHWIC = $scope.cf.getSubSum($scope.activities,"facilityCountHWIC",false);
        	$scope.facilityCountHWOC = $scope.cf.getSubSum($scope.activities,"facilityCountHWOC",false);
        	$scope.facilityCountHW = $scope.cf.getSubSum($scope.activities,"facilityCountHW",false);
        	$scope.facilityCountNONHW = $scope.cf.getSubSum($scope.activities,"facilityCountNONHW",false);*/
        	$scope.showTable = true;
        	$scope.stopSpin();
        };

        
   }])

   .directive('hazReceiversWasteTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'HazReceiversWasteTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			header: '='
  		},
  		templateUrl: 'components/wastetransfer/hazreceivers.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         