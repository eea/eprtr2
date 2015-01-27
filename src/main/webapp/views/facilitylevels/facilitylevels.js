'use strict';

angular.module('myApp.facilitylevels', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitylevels', {
    templateUrl: 'views/facilitylevels/facilitylevels.html',
    controller: 'FacilityLevelsCtrl'
  });
}])

.controller('FacilityLevelsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.activityPanel = false;
	$scope.activityPanelToggleButtonImage = 'images/expand_blue.jpg';
	$scope.activityPanelToggleButtonTitle = 'Expand to include';

	$scope.pollutantPanel = false;
	$scope.pollutantPanelToggleButtonImage = 'images/expand_blue.jpg';
	$scope.pollutantPanelToggleButtonTitle = 'Expand to include';

	$scope.wastePanel = false;
	$scope.wastePanelToggleButtonImage = 'images/expand_blue.jpg';
	$scope.wastePanelToggleButtonTitle = 'Expand to include';
	
	$scope.searchResults = false;

	$scope.toggleActivityPanel = function() {
	    $scope.activityPanel = !$scope.activityPanel;
	    if ($scope.activityPanel) {
	    	$scope.activityPanelToggleButtonImage = 'images/collapse_blue.jpg';
	    	$scope.activityPanelToggleButtonTitle = 'Collapse to exclude';
	    } else {
	    	$scope.activityPanelToggleButtonImage = 'images/expand_blue.jpg';
	    	$scope.activityPanelToggleButtonTitle = 'Expand to include';
	    }
    }

	$scope.togglePollutantPanel = function() {
	    $scope.pollutantPanel = !$scope.pollutantPanel;
	    if ($scope.pollutantPanel) {
	    	$scope.pollutantPanelToggleButtonImage = 'images/collapse_blue.jpg';
	    	$scope.pollutantPanelToggleButtonTitle = 'Collapse to exclude';
	    } else {
	    	$scope.pollutantPanelToggleButtonImage = 'images/expand_blue.jpg';
	    	$scope.pollutantPanelToggleButtonTitle = 'Expand to include';
	    }
    }

	$scope.toggleWastePanel = function() {
	    $scope.wastePanel = !$scope.wastePanel;
	    if ($scope.wastePanel) {
	    	$scope.wastePanelToggleButtonImage = 'images/collapse_blue.jpg';
	    	$scope.wastePanelToggleButtonTitle = 'Collapse to exclude';
	    } else {
	    	$scope.wastePanelToggleButtonImage = 'images/expand_blue.jpg';
	    	$scope.wastePanelToggleButtonTitle = 'Expand to include';
	    }
    }
	
	$scope.search = function() {
	    $scope.searchResults = true;
    }
	
	$http.get('/eprtr/reportingYears').success(function(data, status, headers, config) {
		$scope.reportingYears = data;
		$scope.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
	});
}]);