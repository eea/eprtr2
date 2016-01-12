'use strict';

// Declare app level module which depends on views, and components

var myApp = angular.module('myApp', [
        'ui.bootstrap',
        'ngRoute',
        'leaflet-directive',
        'angular-cookie-law',
        'myApp.home',
        'myApp.about',
        'myApp.facilitylevels',
        'myApp.facilitydetails',
        'myApp.areaoverview',
        'myApp.search-placement',
        'myApp.esrileafmap',
        'myApp.fd-main',
        'myApp.industrialactivity',
        'myApp.pollutantreleases',
        'myApp.pollutanttransfers',
        'myApp.wastetransfers',
        'myApp.timeseriesview',
        'myApp.timeseries',
        'myApp.staticview',
        'myApp.navsearch',
        'myApp.navlibrary',
        'myApp.diffuseemissions',
        'myApp.diffemissionsair',
        'myApp.diffemissionswater',
        'myApp.emissionmapair',
        'myApp.emissionmapwater',
        'myApp.pollutantinfo',
        'myApp.pd-main',
        'myApp.faqview',
        'myApp.downloadguidance',
        'myApp.glossaryview',
        'myApp.lcplevels',
        'myApp.lcp-search-placement',
        'myApp.lcpdetailsview',
        'myApp.survey'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});
    }])

    .controller('HeaderController', function($scope, $location, $modal) {
        $scope.isActive = function(route) {
            return route === $location.url();
        };
        $scope.surveyopened;
       
    	$scope.checkCookie = function(name){
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0)==' '){
                     c = c.substring(1);
                }
                if (c.indexOf(name+'=') == 0){
                        return true;
                }
            }
            return false;
    	}
    	$scope.openSurvey = function () {
    		$scope.surveyopened = true;
     	 	var modalInstance = $modal.open({
     	 		templateUrl: 'eprtrSurveyContent.html',
     	 		controller: 'ModalEprtrSurveyCtrl',
     	 		//size: 'lg',
     	 		resolve: {
     	 			items: function () {
     	              //return $scope.items;
     	          }
     	      }
     	  });
     	 }; 
    	//var co = document.cookie.split(';');
    	if(!$scope.checkCookie('eprtrsurvey') && !$scope.surveyopened){
    		$scope.openSurvey();
    	}
    })
    .controller('ModalEprtrSurveyCtrl', function ($scope, $modalInstance) {

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.finish = function () {
		$modalInstance.close();
	};

})
    ;
/*
google.setOnLoadCallback(function() {
    angular.bootstrap(document, ['myApp']);
});

google.load('visualization', '1', {packages: ['corechart']});*/