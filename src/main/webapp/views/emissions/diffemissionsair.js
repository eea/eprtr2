'use strict';

angular.module('myApp.diffemissionsair', ['ngRoute','ngSanitize', 'myApp.emission-air-search-filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffemissionsair', {
    templateUrl: 'views/emissions/diffemissionsair.html',
    controller: 'DiffEmissionsAirCtrl'
  });
}])

.controller('DiffEmissionsAirCtrl', ['$scope','$filter', 'searchFilter', 'emissionsService', function($scope, $filter, searchFilter, emissionsService) {
	
	$scope.searchFilter = searchFilter;
    /**
     * Tab handling
     * */
            
    $scope.active = {
		fddetails: true
	};
    $scope.activateTab = function(tab) {
    	$scope.active = {}; //reset
    	$scope.active[tab] = true;
	};
	$scope.setActiveTab = function(tab) {
		$scope.active[tab] = true;
	};

	emissionsService.get().then(function (data) {
		$scope.de = data.DiffuseSources;
    });
	
    $scope.$watch('searchFilter.selectedLayer', function(value) {
    	if(value != undefined && $scope.de){
	    	$scope.title = $scope.de[$scope.searchFilter.selectedLayer+'.TitleFull'];
	    	$scope.generalinfo = $scope.de[$scope.searchFilter.selectedLayer+'.GeneralInformation'];
	    	$scope.methodology = $scope.de[$scope.searchFilter.selectedLayer+'.Methodology'];
	    	$scope.sourcedata = $scope.de[$scope.searchFilter.selectedLayer+'.SourceData'];
	    	$scope.searchResults = true;
    	}
    });   

	
}]);