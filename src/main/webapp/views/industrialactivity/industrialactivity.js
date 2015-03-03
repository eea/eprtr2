'use strict';

angular.module('myApp.industrialactivity', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/industrialactivity', {
            templateUrl: 'views/industrialactivity/industrialactivity.html',
            controller: 'IndustrialActivityCtrl'
        });
    }])

    .controller('IndustrialActivityCtrl', ['$scope', function($scope) {
        $scope.activityPanel = true;
    }])
;