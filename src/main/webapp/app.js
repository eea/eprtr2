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
  'myApp.version',
  'myApp.search-placement',
  'myApp.esrileafmap'/*,
  'myApp.esritestmap'*/
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}])

.controller('HeaderController', function($scope, $location) {	
    $scope.isActive = function(route) {     	
        return route === $location.url();
    }
});
