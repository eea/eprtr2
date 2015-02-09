'use strict';

angular.module('myApp.facilitylevels', ['ngRoute', 'myApp.search-filter', 'restangular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facilitylevels', {
    templateUrl: 'views/facilitylevels/facilitylevels.html',
    controller: 'FacilityLevelsCtrl'
  });
}])

.controller('FacilityLevelsCtrl', ['$scope', '$filter', '$http', 'searchFilter', 'Restangular', function($scope, $filter, $http, searchFilter, Restangular) {
	$scope.searchFilter = searchFilter;
	
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
	
	// init
    $scope.sort = {       
                sortingOrder : 'facilityName',
                reverse : false
            };
    
    $scope.gap = 5;
    
	$scope.searchResults = false;
    $scope.items = [];
    $scope.itemsPerPage = 30;
    $scope.pagedItems = [];
    $scope.currentPage = 1;
    $scope.totalItemCount = 0;
    
    $scope.$watch('currentPage', function(value) {
    	if ($scope.currentSearchFilter !== undefined) {
    		$scope.performSearch();
    	}
    });
    $scope.$watch('sort.sortingOrder', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch();
    	}
    });
    
    $scope.$watch('sort.reverse', function(value) {
    	var prevPage = $scope.currentPage;
    	$scope.currentPage = 1;
    	if ($scope.currentSearchFilter !== undefined && prevPage == 1) {
    		$scope.performSearch();
    	}
    });
	
	$scope.search = function() {
		$scope.currentSearchFilter = $scope.searchFilter;
	    $scope.searchResults = true;
        $scope.currentPage = 1;
        $scope.sort.sortingOrder = 'facilityName';
        $scope.sort.reverse = false;
        $scope.performSearch();
    }
	
	$scope.performSearch = function() {
		var rest = Restangular.withConfig(function(RestangularConfigurer) {
		    RestangularConfigurer.setFullResponse(true);
		});
		
	    var facilitySearch = rest.all('eprtr/facilitySearch');
	    
	    var queryParams = {ReportingYear: $scope.currentSearchFilter.selectedReportingYear.year};
	    if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.countryId) {
	    	queryParams.LOV_CountryID = $scope.currentSearchFilter.selectedReportingCountry.countryId;
	    }
	    if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
	    	queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
	    }
	    queryParams.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
	    queryParams.limit = $scope.itemsPerPage;
	    queryParams.order = $scope.sort.sortingOrder;
	    queryParams.desc = $scope.sort.reverse;
	    
	    facilitySearch.getList(queryParams).then(function(response) {
	        $scope.items = response.data;
	        $scope.totalItemCount = response.headers('X-Count');
	    });
	}
    
    $scope.hasItems = function() {
    	return $scope.items.length > 0;
    }
}])

.directive("customSort", function() {
return {
    restrict: 'A',
    transclude: true,    
    scope: {
      order: '=',
      sort: '='
    },
    template : 
      ' <a ng-click="sort_by(order)" style="color: #555555;">'+
      '    <span ng-transclude></span>'+
      '    <i ng-class="selectedCls(order)"></i>'+
      '</a>',
    link: function(scope) {
                
    // change sorting order
    scope.sort_by = function(newSortingOrder) {       
        var sort = scope.sort;
        
        if (sort.sortingOrder == newSortingOrder){
            sort.reverse = !sort.reverse;
        } else {
        	sort.reverse = false;
        }                    

        sort.sortingOrder = newSortingOrder;
    };
    
   
    scope.selectedCls = function(column) {
        if(column == scope.sort.sortingOrder){
            return ('fa fa-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
        }
        else{            
            return'fa fa-sort' 
        }
    };      
  }// end link
}
})

;