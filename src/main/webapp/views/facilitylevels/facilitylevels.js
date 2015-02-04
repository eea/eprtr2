'use strict';

angular.module('myApp.facilitylevels', ['ngRoute', 'myApp.search-filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitylevels', {
    templateUrl: 'views/facilitylevels/facilitylevels.html',
    controller: 'FacilityLevelsCtrl'
  });
}])

.controller('FacilityLevelsCtrl', ['$scope', '$http', 'searchFilter', function($scope, $http, searchFilter) {
	$scope.searchFilter = searchFilter;
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
	    $scope.hasSearchResults = true;
	    
	    var querystring = '';
	    querystring = querystring + 'ReportingYear=' + $scope.searchFilter.selectedReportingYear.year;
	    if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
	    	querystring = querystring + '&LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId;
	    }
	    if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.groupId) {
	    	querystring = querystring + '&LOV_AreaGroupID=' + $scope.searchFilter.selectedReportingCountry.groupId;
	    }
	    $http.get('/eprtr/facilitySearch?' + querystring).success(function(data, status, headers, config) {
	        $scope.searchResults = data;
	    });
    }
	
}]);