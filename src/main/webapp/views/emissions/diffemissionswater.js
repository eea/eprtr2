'use strict';

angular.module('myApp.diffemissionswater', ['ngRoute','ngSanitize', 'myApp.emission-water-search-filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffemissionswater', {
    templateUrl: 'views/emissions/diffemissionswater.html',
    controller: 'DiffEmissionsWaterCtrl'
  });
}])

.controller('DiffEmissionsWaterCtrl', ['$scope','$filter', 'searchFilter', 'emissionsService', function($scope, $filter, searchFilter, emissionsService) {
	
	/*$scope.aboutemissions = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor. " +
			" Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.";
	*//*translationService.get('Static').then(function (data) {
		$scope.welcome = data['HomeWelcomeText'];
    });*/
	
	
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
    	if(value != undefined){
	    	$scope.title = $scope.de[$scope.searchFilter.selectedLayer+'.TitleFull'];
	    	$scope.generalinfo = $scope.de[$scope.searchFilter.selectedLayer+'.GeneralInformation'];
	    	$scope.methodology = $scope.de[$scope.searchFilter.selectedLayer+'.Methodology'];
	    	$scope.sourcedata = $scope.de[$scope.searchFilter.selectedLayer+'.SourceData'];
	    	$scope.searchResults = true;
    	}
    });   
	
}]);