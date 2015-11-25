'use strict';

angular.module('myApp.diffemissionswater', ['ngRoute','ngSanitize', 'myApp.emission-water-search-filter'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffemissionswater', {
    templateUrl: 'views/emissions/diffemissionswater.html',
    controller: 'DiffEmissionsWaterCtrl'
  });
}])

.controller('DiffEmissionsWaterCtrl', ['$scope','$filter', 'searchFilter', 'emissionsService', 'eprtrcms', function($scope, $filter, searchFilter, emissionsService,eprtrcms) {
	
	/*$scope.aboutemissions = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor. " +
			" Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.";
	*/
	
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
	/*emissionsService.get().then(function (data) {
		$scope.de = data.DiffuseSources;
    });*/
	
    $scope.$watch('searchFilter.selectedLayer', function(value) {
    	if(value != undefined && $scope.de != undefined){
	    	$scope.title = $scope.de[$scope.searchFilter.selectedLayer+'.TitleFull'];
	    	$scope.generalinfo = $scope.de[$scope.searchFilter.selectedLayer+'.GeneralInformation'];
	    	$scope.methodology = $scope.de[$scope.searchFilter.selectedLayer+'.Methodology'];
	    	$scope.sourcedata = $scope.de[$scope.searchFilter.selectedLayer+'.SourceData'];
	    	$scope.searchResults = true;
    	}
    });   
	
}]);