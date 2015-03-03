'use strict';

angular.module('myApp.facilitydetails', ['ngRoute','myApp.fd-main'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitydetails', {
    templateUrl: 'views/facilitydetails/facilitydetails.html',
    controller: 'FacilityDetailsController'
  });
}])

.controller('FacilityDetailsController', ['$scope','$routeParams',  function($scope, $routeParams) {
	
    $scope.fdrID = $routeParams.FacilityReportID !== undefined ? $routeParams.FacilityReportID: null;// 10;
    if($scope.fdrID === null){
	    $scope.fdID = $routeParams.FacilityID !== undefined ? $routeParams.FacilityID: 9893;//null;
	    $scope.year = $routeParams.ReportingYear !== undefined ? $routeParams.ReportingYear: 2010;//null;
    }

}]);