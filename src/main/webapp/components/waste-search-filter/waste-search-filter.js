'use strict';

angular.module('myApp.wasteSearchFilter', ['restangular', 'myApp.search-filter'])

    .controller('wasteSearchFilterController', ['$scope', 'wasteSearchFilter', 'searchFilter', function($scope, wasteSearchFilter, searchFilter) {
        $scope.wasteSearchFilter = wasteSearchFilter;
        searchFilter.wasteSearchFilter = wasteSearchFilter;

        var allReceivingCountries = { name : 'All receiving countries' };
        $scope.wasteSearchFilter.selectedReceivingCountry = allReceivingCountries;
        $scope.receivingCountries = [allReceivingCountries];
    }])

    .factory('wasteSearchFilter', [function() {
        return {
            filter : function(queryParams) {
            }
        };
    }])

    .directive('wasteSearchFilterDirective', function() {
        return {
            controller: 'wasteSearchFilterController',
            templateUrl: 'components/waste-search-filter/waste-search-filter.html'
        };
    });
