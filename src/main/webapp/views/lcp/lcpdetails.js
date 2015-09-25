'use strict';

angular.module('myApp.lcpdetailsview', ['ngRoute','myApp.lcpdetails'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lcpdetailsview', {
    templateUrl: 'views/lcp/lcpdetails.html',
    controller: 'LcpDetailsViewController'
  });
}])

.controller('LcpDetailsViewController', ['$scope','$routeParams',  function($scope, $routeParams) {
	
    $scope.PlantID = $routeParams.PlantID !== undefined ? $routeParams.PlantID: null;// 10;

}]);