'use strict';

angular.module('myApp.wastetransfers', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/wastetransfers', {
            templateUrl: 'views/wastetransfers/wastetransfers.html',
            controller: 'WasteTransfersCtrl'
        });
    }])

    .controller('WasteTransfersCtrl', ['$scope', function($scope) {
    }])
;