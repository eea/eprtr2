'use strict';

angular.module('myApp.downloadguidance', ['ngRoute','restangular','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/downloadguidance', {
    templateUrl: 'views/static/downloadguidance.html',
    controller: 'DownloadguidanceController'
  });
}])

.controller('DownloadguidanceController', 
		['$scope', '$routeParams', 'eprtrcms', function($scope, $routeParams, eprtrcms  ) {

		eprtrcms.get('Static',null).then(function (data) {
			$scope.head = data.DownloadGuidancePageHeader;
			$scope.subcontent = data.DownloadGuidancePageSubContent;
			$scope.content = data.DownloadGuidancePageContent;
		});	
		
}]);

