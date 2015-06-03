'use strict';

// Declare app level module which depends on views, and components

var myApp = angular.module('myApp', [
        'ui.bootstrap',
        'ngRoute',
        'leaflet-directive',
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
        'myApp.pollutantinfo',
        'myApp.pd-main'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/home'});
    }])

    .controller('HeaderController', function($scope, $location) {
        $scope.isActive = function(route) {
            return route === $location.url();
        };
    })
    ;
