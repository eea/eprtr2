'use strict';

angular.module('myApp.HazReceiversTreatmentTab', ['restangular','ngSanitize','angularSpinner'])

   .controller('HazReceiversTreatmentCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory,countFactory, usSpinnerService) {
        $scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
        //$scope.queryParams = {};
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_c = data.Common;
        		$scope.tr_f = data.Facility;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lwt = data.LOV_WASTETREATMENT;
        	  });
        };
        $scope.translate();
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

      	/**
      	 * Facility Table functions
      	 */
      	
      	$scope.sort = {
                  sortingOrder : 'fromFacilityName',
                  reverse : false
              };
      
      
      	$scope.searchResults = false;
      $scope.items = [];
      $scope.itemsPerPage = 10;
      $scope.pagedItems = [];
      $scope.currentPage = 1;
      $scope.totalItemCount = 0;

      $scope.$watch('currentPage', function(value) {
      	if ($scope.currentSearchFilter !== undefined) {
      		$scope.getData();
      	}
      });
      $scope.$watch('sort.sortingOrder', function(value) {
      	var prevPage = $scope.currentPage;
      	$scope.currentPage = 1;
      	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
      		$scope.getData();
      	}
      });
      
      $scope.$watch('sort.reverse', function(value) {
      	var prevPage = $scope.currentPage;
      	$scope.currentPage = 1;
      	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
      		$scope.getData();
      	}
      });

          /*END */
          
          
          
        
    	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
        });

        $scope.$watchCollection('[tr_c,queryparams,visible]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_wt != undefined && $scope.visible ){
                
        		//Clear collection
        		$scope.items = [];
        		//get data
                $scope.currentPage = 1;
                $scope.sort.sortingOrder = 'fromFacilityName';
                $scope.sort.reverse = false;
        		$scope.startSpin();
        		$scope.getData();
        	}
        });

        $scope.getData = function(){

        	$scope.searchService = $scope.restconfig.all('wastetransferHazardousWasteTreater');
        	var qp = {};
		    for(var key in $scope.queryparams) {
		        if(key != 'whpCountryCode') {
		        	qp[key] = $scope.queryparams[key];
		        }
		    }
		    qp['whpCountryCode']  = $scope.whpcountrycode;  
		    
		    qp.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
		    qp.limit = $scope.itemsPerPage;
		    qp.order = $scope.sort.sortingOrder;
		    qp.desc = $scope.sort.reverse;
		        
    		$scope.searchService.getList(qp).then(function(response) {
        		$scope.items = response.data;
//          		$scope.totalSearchResult += parseInt($scope.wastetransfercount);
        		$scope.totalItemCount = response.headers('X-Count');
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
        	$scope.facilityCountNONHW = $scope.cf.getSubSum($scope.activities,"facilityCountNONHW",false);
        	$scope.showTable = true;
        	$scope.stopSpin();*/
        };

        
   }])

   .directive('hazReceiversTreatmentTab', function() {
  	return {
  		restrict: 'E',
  		controller: 'HazReceiversTreatmentTabCtrl',
          transclude: true,
  		scope: {
  			queryparams: '=',
  			whpcountrycode: '=',
  			visible: '='
  			
  		},
  		templateUrl: 'components/wastetransfer/hazreceiverstreatment.html',
  		link: function(scope, element, attrs){
  			scope.$watch('queryparams', function(value){
  				//lets debug
  			})
  		}
  	};
  });
         