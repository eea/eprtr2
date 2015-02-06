'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.bootstrap',
  'ngRoute',
  'myApp.home',
  'myApp.about',
  'myApp.facilitylevels',
  'myApp.facilitydetails',
  'myApp.version',
  'myApp.search-placement'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

