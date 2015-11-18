'use strict';

angular.module('myApp.diffemissionsair', ['ngRoute','ngSanitize', 'myApp.emission-air-search-filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffemissionsair', {
    templateUrl: 'views/emissions/diffemissionsair.html',
    controller: 'DiffEmissionsAirCtrl'
  });
}])

.controller('DiffEmissionsAirCtrl', ['$scope','$filter', 'searchFilter', 'emissionsService', 'eprtrcms', function($scope, $filter, searchFilter, emissionsService,eprtrcms) {
	
	$scope.searchFilter = searchFilter;
    $scope.resize_icon = "fa fa-arrow-left"
    $scope.bigmap = false;
    $scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    $scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    $scope.mapctrl = {};
	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -350)+'px';

    $scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });
    /**
     * MAp handling*/
    $scope.togglemapview = function(){
    	if($scope.bigmap){
        	$scope.bigmap = false;
        	$scope.resize_icon = "fa fa-arrow-left"
        	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
        	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
    	}
    	else{
        	$scope.bigmap = true;
        	$scope.resize_icon = "fa fa-arrow-right"
        	$scope.mapclss = "col-md-12 minor-padding";
        	$scope.resclss = "col-md-12 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowReducedMap'];
    	}
    	$scope.mapctrl.redraw();
    }
    
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
	eprtrcms.get('DiffuseSources',null).then(function (data) {
		$scope.de = data;
		if(!data){
			emissionsService.get().then(function (edata) {
				$scope.de = edata.DiffuseSources;
		    });	
		}
	});
	eprtrcms.get('Common',null).then(function (data) {
		$scope.tr_c = data;
		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
	});
	
/*	emissionsService.get().then(function (data) {
		$scope.de = data.DiffuseSources;
    });*/
	
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