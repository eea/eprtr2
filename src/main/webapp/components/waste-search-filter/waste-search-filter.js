'use strict';

angular.module('myApp.wasteSearchFilter', ['restangular', 'myApp.search-filter'])

    .controller('wasteSearchFilterController', ['$scope', 'wasteSearchFilter', 'searchFilter', 'receivingCountryService', function($scope, wasteSearchFilter, searchFilter, receivingCountryService) {
        $scope.wasteSearchFilter = wasteSearchFilter;
        searchFilter.wasteSearchFilter = wasteSearchFilter;

        var allReceivingCountries = { name : 'All receiving countries' };
        $scope.wasteSearchFilter.selectedReceivingCountry = allReceivingCountries;
        $scope.receivingCountries = [allReceivingCountries];
        receivingCountryService.getList().then(function(data) {
        	 $scope.receivingCountries = $scope.receivingCountries.concat(data);
        });
    }])

    .factory('wasteSearchFilter', [function() {
        return {
            nonHazardousWasteTransfer : true,
            hazardousWasteCountryTransfer : true,
            hazardousWasteTransboundaryTransfer : true,

            recoveryTreatment : true,
            disposalTreatment : true,
            unspecifiedTreatment : true,

            filter : function(queryParams) {

                var type = [];
                if (this.nonHazardousWasteTransfer) {
                    type = type.concat('NONHW');
                }
                if (this.hazardousWasteCountryTransfer) {
                    type = type.concat('HWIC');
                }
                if (this.hazardousWasteTransboundaryTransfer) {
                    type = type.concat('HWOC');
                }
                if (this.hazardousWasteCountryTransfer || this.hazardousWasteTransboundaryTransfer) {
                    type = type.concat('HW');
                }
                if (type.length > 0) {
                    queryParams.WasteTypeCode = type;
                }

                var treatment = [];
                if (!this.recoveryTreatment) {
                    treatment = treatment.concat('R');
                }
                if (!this.disposalTreatment) {
                    treatment = treatment.concat('D');
                }
                if (!this.unspecifiedTreatment) {
                    treatment = treatment.concat('U');
                }
                if (treatment.length > 0) {
                    queryParams.WasteTreatmentCode = treatment;
                }

                if (this.selectedReceivingCountry.code) {
                    queryParams.WHPCountryID = this.selectedReceivingCountry.lov_CountryID;
                }
            }
        };
    }])
    
    .service('receivingCountryService', ['Restangular', function(Restangular){
        return Restangular.service('receivingCountry');
    }])

    .directive('wasteSearchFilterDirective', function() {
        return {
            controller: 'wasteSearchFilterController',
            templateUrl: 'components/waste-search-filter/waste-search-filter.html'
        };
    });
