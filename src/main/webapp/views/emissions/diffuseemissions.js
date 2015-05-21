'use strict';

angular.module('myApp.diffuseemissions', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffuseemissions', {
    templateUrl: 'views/emissions/diffuseemissions.html',
    controller: 'DiffuseEmissionsCtrl'
  });
}])

.controller('DiffuseEmissionsCtrl', ['$scope','$filter', 'emissionsService', function($scope, $filter, emissionsService) {
	
	emissionsService.get('Approach').then(function (data) {
		$scope.aboutdiffemissions = data;
    });
	$scope.descair = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. ";
	$scope.descwater = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. ";
}]);