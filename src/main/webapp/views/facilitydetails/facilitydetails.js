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
    $scope.frID = 23;

	/*esriTestMap.mapelem.addWhereStr('5');
	esriTestMap.mapelem.addTextStr("Skudder muddr");
*/

}]);