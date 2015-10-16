'use strict';

angular.module('myApp.wastetransferconfidential', ['restangular','ngSanitize'])

   .controller('WasteTransferConfCtrl', ['$scope', '$filter', 'Restangular',
                                       'eprtrcms','formatStrFactory', function($scope, $filter,  
                                    		   Restangular,eprtrcms,formatStrFactory) {
        $scope.ff = formatStrFactory;
        //$scope.queryParams = {};
        $scope.wtconfcoll = [];
        $scope.wtconfreasoncoll = [];

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
    	eprtrcms.get('LOV_NUTSREGION',null).then(function (data) {
    		$scope.tr_lnr = data;
    	});
    	eprtrcms.get('LOV_RIVERBASINDISTRICT',null).then(function (data) {
    		$scope.tr_lrbd = data;
    	});
    	eprtrcms.get('LOV_CONFIDENTIALITY',null).then(function (data) {
    		$scope.tr_lcon = data;
    	});
    	eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
    		$scope.tr_lco = data;
    	});
    	eprtrcms.get('LOV_ANNEXIACTIVITY',null).then(function (data) {
    		$scope.tr_laa = data;
    	});
    	eprtrcms.get('LOV_WASTETYPE',null).then(function (data) {
    		$scope.tr_lwt = data;
    	});
    	eprtrcms.get('Confidentiality',null).then(function (data) {
    		$scope.tr_con = data;
    	});
    	eprtrcms.get('LOV_POLLUTANT',null).then(function (data) {
    		$scope.tr_lpo = data;
    	});
    	eprtrcms.get('Pollutant',null).then(function (data) {
    		$scope.tr_p = data;
    	});

        
        
        $scope.$watchCollection('[tr_lovwt,queryparams,confidential]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_lovwt != undefined && $scope.confidential ){
                $scope.wtconfcoll = [];
                $scope.wtconfreasoncoll = [];
        		$scope.reqAllfData();
        		$scope.reqConfData();
        		$scope.reqReasonData();
        	}
        });
        
        $scope.reqAllfData = function(){
        	if ($scope.confidential && $scope.queryparams != undefined){

    			var qp = {};
    		    for(var key in $scope.queryparams) {
    		        if(key != 'WasteTypeCode') {
    		        	qp[key] = $scope.queryparams[key];
    		        }
    		    }
        		
        		var rest = Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setFullResponse(true);
                });
                var wastetransferSearchCounts = rest.one('wastetransferCounts');
                
                wastetransferSearchCounts.get(qp).then(function(response) {
                    var wtall = angular.copy(response.data);
                    wtall.descr = 'WasteTransfers';
                    $scope.wtconfcoll.push(wtall);
                });
        		
        	}
        };

        $scope.reqConfData = function(){
        	if ($scope.confidential && $scope.queryparams != undefined){

    			var qp = {};
    		    for(var key in $scope.queryparams) {
    		        if(key != 'WasteTypeCode') {
    		        	qp[key] = $scope.queryparams[key];
    		        }
    		    }
        		
        		var rest = Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setFullResponse(true);
                });
                var wastetransferSearchCounts = rest.one('wastetransferConfidentialCounts');
                
                wastetransferSearchCounts.get(qp).then(function(response) {
                    var wtall = angular.copy(response.data);
                    wtall.descr = 'WasteTransfersConfidentiality';
                    $scope.wtconfcoll.push(wtall);
                });
        	}
        };
        
        //wastetransferConfidentialReason
        $scope.reqReasonData = function(){
        	if ($scope.confidential && $scope.queryparams != undefined){

    			var qp = {};
    		    for(var key in $scope.queryparams) {
    		        if(key != 'WasteTypeCode') {
    		        	qp[key] = $scope.queryparams[key];
    		        }
    		    }
        		
        		var rest = Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setFullResponse(true);
                });
                var wastetransferSearchReason = rest.all('wastetransferConfidentialReason');
                
                wastetransferSearchReason.getList(qp).then(function(response) {
                    $scope.wtconfreasoncoll = response.data;
                });
        	}
        };
        
        
   }])

 .directive('wastetransferconfidential', function() {
	return {
		restrict: 'E',
		controller: 'WasteTransferConfCtrl',
        transclude: true,
		scope: {
			confidential: '=', 
			queryparams: '=' 
		},
		templateUrl: 'components/wastetransfer/wastetransferconfidential.html',
		link: function(scope, element, attrs){
				scope.$watch('queryparams', function(value) {
				/*JAVA Enum cannot handle the character - so NON-HW is converted into NONHW*/
				/*if (scope.queryParams.WasteTypeCode != undefined){
					for (var i=0; i< scope.queryParams.WasteTypeCode.length; i++) {
						scope.queryParams.WasteTypeCode[i] = scope.queryParams.WasteTypeCode[i].replace("-","");
					}				
				}*/
			});
		}
	};
});
        
