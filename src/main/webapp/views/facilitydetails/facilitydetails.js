'use strict';

angular.module('myApp.facilitydetails', ['ngRoute','myApp.esrileafmap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitydetails', {
    templateUrl: 'views/facilitydetails/facilitydetails.html',
    controller: 'FacilityDetailsController'
  });
}])

.controller('FacilityDetailsController', ['$scope',  function($scope) {
	$scope.fdtitle = 'Hej Mor'
    $scope.frID = 89352;
	$scope.objwhere = {
			cc: '',
			ye: 2007,
			wh: ''
	};
    $scope.setWhereStr = function(){
    	$scope.objwhere.wh = 
    	   {"CountryCode": $scope.objwhere.cc,
    	   "ReportingYear":$scope.objwhere.ye};
    }

    if (!$scope.objwhere.wh){
        $scope.setWhereStr();
    };
    
    $scope.$watch('objwhere.cc', function(value) {
        //console.log('objwhere1: '+ value);
        $scope.setWhereStr();
        //console.log('objwhere2: '+ JSON.stringify($scope.objwhere.wh));
    });

    $scope.$watch('objwhere.ye', function(value) {
        //console.log('objwhere3: '+ value);
        $scope.setWhereStr();
        //console.log('objwhere4: '+ JSON.stringify($scope.objwhere.wh));
    });

    //$scope.setWhereStr = '';
	/*esriTestMap.mapelem.addWhereStr('5');
	esriTestMap.mapelem.addTextStr("Skudder muddr");
*/

}]);