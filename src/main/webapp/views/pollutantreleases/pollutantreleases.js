'use strict';

angular.module('myApp.pollutantreleases', ['ngRoute', 'googlechart', 'myApp.search-filter', 'restangular'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutantreleases', {
            templateUrl: 'views/pollutantreleases/pollutantreleases.html',
            controller: 'PollutantReleasesCtrl'
        });
    }])

    .controller('PollutantReleasesCtrl', ['$scope', 'searchFilter', 'Restangular', function($scope, searchFilter, Restangular) {
        $scope.pollutantPanel = true;
        $scope.showReleasesToInputField = true;
        $scope.pollutantPanelTitle = 'Pollutant releases';

        $scope.searchFilter = searchFilter;
        $scope.queryParams = {};
        $scope.queryParams.ReportingYear = -1;

        $scope.search = function() {
            $scope.currentSearchFilter = $scope.searchFilter;
            $scope.searchResults = true;
            $scope.performSearch();
        };

        $scope.performSearch = function() {
            var rest = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setFullResponse(true);
            });

            var facilitySearch = rest.all('pollutantreleaseSearch');

            var queryParams = {ReportingYear: $scope.currentSearchFilter.selectedReportingYear.year};
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.countryId) {
                queryParams.LOV_CountryID = $scope.currentSearchFilter.selectedReportingCountry.countryId;
                if ($scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID) {
                    queryParams.LOV_NUTSRegionID = $scope.currentSearchFilter.selectedRegion.lov_NUTSRegionID;
                }
                else if ($scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID) {
                    queryParams.LOV_RiverBasinDistrictID = $scope.currentSearchFilter.selectedRegion.lov_RiverBasinDistrictID;
                }
            }
            if ($scope.currentSearchFilter.selectedReportingCountry !== undefined && $scope.currentSearchFilter.selectedReportingCountry.groupId) {
                queryParams.LOV_AreaGroupID = $scope.currentSearchFilter.selectedReportingCountry.groupId;
            }
            if ($scope.currentSearchFilter.activitySearchFilter) {
                $scope.currentSearchFilter.activitySearchFilter.filter(queryParams);
            }
            if ($scope.currentSearchFilter.pollutantSearchFilter) {
                $scope.currentSearchFilter.pollutantSearchFilter.filter(queryParams);
            }
            $scope.queryParams = queryParams;

            facilitySearch.getList(queryParams).then(function(response) {
                $scope.items = response.data;
                $scope.mediumType = 'Water';
                $scope.quantityAir = response.headers('X-QuantityAir');
                $scope.quantityWater = response.headers('X-QuantityWater');
                $scope.quantitySoil = response.headers('X-QuantitySoil');

                var graphdata = {};
                for (var i = 0; i < $scope.items.length; i++) {
                    if (!graphdata[$scope.items[i].iaactivityCode]) {
                        graphdata[$scope.items[i].iaactivityCode] = {c: [
                            {v: $scope.items[i].iaactivityCode},
                            {v: $scope.items[i]['quantity' + $scope.mediumType]}
                        ]};
                    } else {
                        graphdata[$scope.items[i].iaactivityCode].c[1].v =
                            graphdata[$scope.items[i].iaactivityCode].c[1].v
                            + $scope.items[i]['quantity' + $scope.mediumType];
                    }
                }

                var graphdata_array = [];
                for (var key in graphdata) {
                    if (graphdata.hasOwnProperty(key)) {
                        graphdata_array = graphdata_array.concat(graphdata[key]);
                    }
                }

                $scope.chartObject = {};
                $scope.chartObject.data = {
                    "cols": [
                        {id: "t", label: "Name", type: "string"},
                        {id: "s", label: "Total", type: "number"}
                    ],
                    "rows": graphdata_array
                };
                $scope.chartObject.type = 'PieChart';



            });
        };

        $scope.formatText = function(txt, confidential) {
            if (txt)
            {
                return txt;
            }
            else if (confidential)
            {
                return "CONFIDENTIAL";
            }
            else
            {
                return "-";
            }
        };

        $scope.quantity = function(item) {
            if (item['quantity' + $scope.mediumType])
            {
                return item['quantity' + $scope.mediumType];
            }
            else if (item.confidentialIndicator)
            {
                return "CONFIDENTIAL";
            }
            else
            {
                return "-";
            }
        };

        $scope.quantityAccidental = function(item) {
            if (item['quantityAccidental' + $scope.mediumType])
            {
                return item['quantityAccidental' + $scope.mediumType];
            }
            else if (item.confidentialIndicator)
            {
                return "CONFIDENTIAL";
            }
            else
            {
                return "-";
            }
        };

        $scope.percentageAccidental = function(item) {
            if (item['percentageAccidental' + $scope.mediumType])
            {
                return item['percentageAccidental' + $scope.mediumType];
            }
            else
            {
                return "-";
            }
        };
    }])
;