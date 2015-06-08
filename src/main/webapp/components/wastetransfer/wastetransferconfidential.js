'use strict';

angular.module('myApp.wastetransferconfidential', ['restangular','ngSanitize'])

   .controller('WasteTransferConfCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory) {
        $scope.ff = formatStrFactory;
        //$scope.queryParams = {};
        $scope.wtconfcoll = [];
        $scope.wtconfreasoncoll = [];
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        	  });
        };
        $scope.translate();
        
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
        
