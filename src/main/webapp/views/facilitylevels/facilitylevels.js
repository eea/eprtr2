'use strict';

angular.module('myApp.facilitylevels', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitylevels', {
    templateUrl: 'views/facilitylevels/facilitylevels.html',
    controller: 'FacilityLevelsCtrl'
  });
}])

.controller('FacilityLevelsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.searchResults = false;
	
	$scope.expandButtonImage = 'images/expand_blue.jpg';
	$scope.expandButtonText = 'Expand to include';
	$scope.collapseButtonImage = 'images/collapse_blue.jpg';
	$scope.collapseButtonText = 'Collapse to exclude';

	$scope.activityPanel = false;
	$scope.activityPanelToggleButtonImage = $scope.expandButtonImage;
	$scope.activityPanelToggleButtonTitle = $scope.expandButtonText;
	$scope.toggleActivityPanel = function() {
	    $scope.activityPanel = !$scope.activityPanel;
	    if ($scope.activityPanel) {
	    	$scope.activityPanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.activityPanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.activityPanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.activityPanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }

	$scope.pollutantPanel = false;
	$scope.pollutantPanelToggleButtonImage = $scope.expandButtonImage;
	$scope.pollutantPanelToggleButtonTitle = $scope.expandButtonText;
	$scope.togglePollutantPanel = function() {
	    $scope.pollutantPanel = !$scope.pollutantPanel;
	    if ($scope.pollutantPanel) {
	    	$scope.pollutantPanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.pollutantPanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.pollutantPanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.pollutantPanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }

	$scope.wastePanel = false;
	$scope.wastePanelToggleButtonImage = $scope.expandButtonImage;
	$scope.wastePanelToggleButtonTitle = $scope.expandButtonText;
	$scope.toggleWastePanel = function() {
	    $scope.wastePanel = !$scope.wastePanel;
	    if ($scope.wastePanel) {
	    	$scope.wastePanelToggleButtonImage = $scope.collapseButtonImage;
	    	$scope.wastePanelToggleButtonTitle = $scope.collapseButtonText;
	    } else {
	    	$scope.wastePanelToggleButtonImage = $scope.expandButtonImage;
	    	$scope.wastePanelToggleButtonTitle = $scope.expandButtonText;
	    }
    }
	
	$scope.search = function() {
	    $scope.searchResults = true;
    }
	
}]);