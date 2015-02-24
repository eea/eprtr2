'use strict';

angular.module('myApp.facilitydetails', ['ngRoute','myApp.fd-main'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitydetails', {
    templateUrl: 'views/facilitydetails/facilitydetails.html',
    controller: 'FacilityDetailsController'
  });
}])

.controller('FacilityDetailsController', ['$scope',  function($scope) {
    $scope.fdrID = 89352;

}]);