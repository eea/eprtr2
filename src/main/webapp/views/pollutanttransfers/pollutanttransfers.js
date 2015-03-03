'use strict';

angular.module('myApp.pollutanttransfers', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutanttransfers', {
            templateUrl: 'views/pollutanttransfers/pollutanttransfers.html',
            controller: 'PollutantTransfersCtrl'
        });
    }])

    .controller('PollutantTransfersCtrl', ['$scope', function($scope) {
        $scope.pollutantPanel = true;
        $scope.pollutantPanelTitle = 'Pollutant transfers';
    }])
;