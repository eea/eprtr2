'use strict';

angular.module('myApp.pollutantreleases', ['ngRoute', 'googlechart'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutantreleases', {
            templateUrl: 'views/pollutantreleases/pollutantreleases.html',
            controller: 'PollutantReleasesCtrl'
        });
    }])

    .controller('PollutantReleasesCtrl', ['$scope', function($scope) {
        $scope.pollutantPanel = true;
        $scope.showReleasesToInputField = true;
        $scope.pollutantPanelTitle = 'Pollutant releases';

        $scope.search = function() {
            $scope.searchResults = true;
            $scope.chartObject = {};
            $scope.chartObject.data = {"cols": [
                {id: "t", label: "Name", type: "string"},
                {id: "s", label: "Total", type: "number"}
            ], "rows": [
                {c: [
                    {v: "5.(f)"},
                    {v: 107.47}
                ]},
                {c: [
                    {v: "9.(a)"},
                    {v: 3.59}
                ]}
            ]};
            $scope.chartObject.type = 'PieChart';
        };
    }])
;