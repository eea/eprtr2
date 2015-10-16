'use strict';

angular.module('myApp.HazReceiversTreatmentTab', ['restangular','ngSanitize','angularSpinner'])

   .controller('HazReceiversTreatmentTabCtrl', ['$scope', '$filter', 'Restangular',
                                       'eprtrcms','formatStrFactory', 'countFactory','usSpinnerService', function($scope, $filter,  
                                    		   Restangular,eprtrcms,formatStrFactory,countFactory, usSpinnerService) {
	   
	   $scope.ff = formatStrFactory;
	    $scope.cf = countFactory;
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
    	eprtrcms.get('LOV_WASTETREATMENT',null).then(function (data) {
    		$scope.tr_lwt = data;
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

      	/**
      	 * Facility Table functions
      	 */
      	
      	$scope.sort = {
                  sortingOrder : 'facilityName',
                  reverse : false
              };
      
      
      	$scope.searchResults = false;
      $scope.items = [];
      $scope.itemsPerPage = 6;
      $scope.pagedItems = [];
      $scope.pager = {};
      /*$scope.pager.currentPage = 1;*/
      $scope.totalItemCount = 0;

      $scope.$watch('pager.currentPage', function(value) {
      	if ($scope.pager != undefined && $scope.pager.currentPage != undefined && $scope.queryparams !== undefined) {
      		$scope.getData();
      	}
      });
      $scope.$watch('sort.sortingOrder', function(value) {
      	var prevPage = $scope.pager.currentPage;
      	$scope.pager.currentPage = 1;
      	if ($scope.queryparams !== undefined && prevPage == 1) {
      		$scope.getData();
      	}
      });
      
      $scope.$watch('sort.reverse', function(value) {
      	var prevPage = $scope.pager.currentPage;
      	$scope.pager.currentPage = 1;
      	if ($scope.queryparams !== undefined && prevPage == 1) {
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
                $scope.pager.currentPage = 1;
                $scope.sort.sortingOrder = 'facilityName';
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
		    
		    qp.offset = ($scope.pager.currentPage - 1) * $scope.itemsPerPage;
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
        	$scope.facilityCountNONHW = $scope.cf.getSubSum($scope.activities,"facilityCountNONHW",false);*/
        	$scope.showTable = true;
        	$scope.stopSpin();
        };

        $scope.hasItems = function() {
        	return $scope.items.length < $scope.totalItemCount;
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
         