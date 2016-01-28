'use strict';

angular.module('myApp.lcp-search-placement', ['myApp.home', 'myApp.search-filter'])

.controller('LcpSearchPlacementController', ['$scope', '$http', 'searchFilter','eprtrcms', 'eprtrmaps', 'lcpconf', function($scope, $http, searchFilter,eprtrcms,eprtrmaps,lcpconf) {
    
	$scope.searchFilter = searchFilter;
	$scope.searchFilter.regionType = '1';
    $scope.searchFilter.selectedLCPCapacities = 'all';	

	eprtrcms.get('Common',null).then(function (data) {
		$scope.tr_c = data;
	});
	eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
		$scope.tr_lco = data;
	});
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});

	/**
	 * Capacities
	 */

/*	$http.get('/reportingYears').success(function(data, status, headers, config) {
        $scope.reportingYears = data;
        $scope.searchFilter.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
    });
*/

	$scope.$watch('mapurls', function(value) {
		if($scope.mapurls){
			var _refyer_q = $scope.mapurls.lcpUrl + '/1/query?where=1%3D1&outFields='
		+ lcpconf.layerfields[1].referenceyear + '&orderByFields=' 
		+ lcpconf.layerfields[1].referenceyear + '&returnDistinctValues=true&f=pjson';
    
	$http.get(_refyer_q).success(function(data, status, headers, config) {
		var _years = [];
		angular.forEach(data.features, function(item) {
			_years.push({"year":item.attributes[lcpconf.layerfields[1].referenceyear]});
		});
	    $scope.reportingYears = _years;
	    $scope.searchFilter.selectedReportingYear = $scope.reportingYears[$scope.reportingYears.length - 1];
		});
		}
	});

	$scope.$watchCollection('[tr_lco,mapurls]', function(value) {
		if($scope.tr_lco && $scope.mapurls){
			var _refcoun_q = $scope.mapurls.lcpUrl + '/1/query?where=1%3D1&outFields='
			+ lcpconf.layerfields[1].memberstate + '&orderByFields=' 
			+ lcpconf.layerfields[1].memberstate + '&returnDistinctValues=true&f=pjson';
		
			$http.get(_refcoun_q).success(function(data, status, headers, config) {
				var _countries = [{"countryId":null,"groupId":1,"id":0,"name":"All Countries"}];
				//{"countryId":15,"groupId":null,"id":4,"name":"Austria"},{"countryId":22,"groupId":null,"id":5,"name":"Belgium"}
				var _c = 0;
				angular.forEach(data.features, function(item) {
					var _m = item.attributes[lcpconf.layerfields[1].memberstate];
					_countries.push({"countryId":_m,"groupId":null,"id":_c,"name":$scope.tr_lco[_m]});
					_c++;
				});
			    $scope.reportingCountries = _countries;
			    $scope.searchFilter.selectedReportingCountry = $scope.reportingCountries[0];	
			});
			
			/*$scope.lcpcapacities = [{'code':'all','value':'All capacities'},
				                     {'code':'300_up','value':'More than 300 MWth'},
				                     {'code':'100_300','value':'Between 100 and 300 MWth'},
				                     {'code':'50_100','value':'Between 50 to 100 MWth'}];*/
		}
	});
	


	
	/*$http.get('/areagroupReportingCountries').success(function(data, status, headers, config) {
        $scope.reportingCountries = data;
        $scope.searchFilter.selectedReportingCountry = $scope.reportingCountries[0];
    });

    $scope.$watch('searchFilter.selectedReportingCountry', function(value) {
        $scope.disableRegionSelect = true;
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            $scope.disableRegionSelect = false;
        }
        //$scope.updateRegions();
    });
*/
    
   /* $scope.$watch('searchFilter.regionType', function(value) {
        $scope.updateRegions();
    });
*/
    
/*    $scope.updateRegions = function() {
        $scope.regions = null;
            $scope.regions = [{'lov_CountryID': null, 'name': 'All regions'}];
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
                $http.get('/regions?LOV_CountryID=' + $scope.searchFilter.selectedReportingCountry.countryId).success(function(data, status, headers, config) {
                    $scope.regions = $scope.regions.concat(data);
                });
        }
        $scope.searchFilter.selectedRegion = $scope.regions[0];
    };*/
}])

.directive('lcpSearchPlacement', function() {
	return {
		controller: 'LcpSearchPlacementController',
		templateUrl: 'components/search-placement/lcp-search-placement.html'
	};
});
