'use strict';

angular.module('myApp.emission-air-search-filter', ['myApp.home', 'myApp.search-filter'])

.constant('deconf_air',{
	sectors:[
	        {'code':'-','name':'Select Sector'},
			{'code':'SECTOR_CODE_INDUSTRIAL','name':'IndustrialReleases'}, 			
			{'code':'SECTOR_CODE_NON_INDUSTRIAL','name':'NonIndustrialCombustion'}, 			
			{'code':'SECTOR_CODE_ROAD','name':'RoadTransport'}, 			
			{'code':'SECTOR_CODE_AGRICULTURE','name':'Agriculture'}, 			
			{'code':'SECTOR_CODE_DOMESTIC_SHIPPING','name':'DomesticShipping'}, 			
			{'code':'SECTOR_CODE_DOMESTIC_AVIATION','name':'DomesticAviation'}, 			
			{'code':'SECTOR_CODE_INTERNATIONAL_SHIPPING','name':'InternationalShipping'}
	],
	layers:[{'id':'air_0', 'cms_id': 'AIR_NOX_IndustrialReleases', 'pol':'NOX', 'sec':'IndustrialReleases'},
	        {'id':'air_1', 'cms_id': 'AIR_NOX_NonIndustrialCombustion', 'pol':'NOX', 'sec':'NonIndustrialCombustion'},
	        {'id':'air_2', 'cms_id': 'AIR_NOX_RoadTransport', 'pol':'NOX', 'sec':'RoadTransport'},
	        {'id':'air_3', 'cms_id': 'AIR_NOX_DomesticShipping', 'pol':'NOX', 'sec':'DomesticShipping'},
	        {'id':'air_4', 'cms_id': 'AIR_NOX_DomesticAviation', 'pol':'NOX', 'sec':'DomesticAviation'},
	        {'id':'air_27', 'cms_id': 'AIR_NOX_InternationalShipping', 'pol':'NOX', 'sec':'InternationalShipping'},
	        {'id':'air_5', 'cms_id': 'AIR_SOX_IndustrialReleases', 'pol':'SOX', 'sec':'IndustrialReleases'},
	        {'id':'air_6', 'cms_id': 'AIR_SOX_NonIndustrialCombustion', 'pol':'SOX', 'sec':'NonIndustrialCombustion'},
	        {'id':'air_7', 'cms_id': 'AIR_SOX_RoadTransport', 'pol':'SOX', 'sec':'RoadTransport'},
	        {'id':'air_8', 'cms_id': 'AIR_SOX_DomesticShipping', 'pol':'SOX', 'sec':'DomesticShipping'},
	        {'id':'air_9', 'cms_id': 'AIR_SOX_DomesticAviation', 'pol':'SOX', 'sec':'DomesticAviation'},
	        {'id':'air_28', 'cms_id': 'AIR_SOX_InternationalShipping', 'pol':'SOX', 'sec':'InternationalShipping'},
	        {'id':'air_10', 'cms_id': 'AIR_PM10_IndustrialReleases', 'pol':'PM10', 'sec':'IndustrialReleases'},
	        {'id':'air_11', 'cms_id': 'AIR_PM10_NonIndustrialCombustion', 'pol':'PM10', 'sec':'NonIndustrialCombustion'},
	        {'id':'air_12', 'cms_id': 'AIR_PM10_RoadTransport', 'pol':'PM10', 'sec':'RoadTransport'},
	        {'id':'air_13', 'cms_id': 'AIR_PM10_DomesticShipping', 'pol':'PM10', 'sec':'DomesticShipping'},
	        {'id':'air_14', 'cms_id': 'AIR_PM10_DomesticAviation', 'pol':'PM10', 'sec':'DomesticAviation'},
	        {'id':'air_15', 'cms_id': 'AIR_PM10_Agriculture', 'pol':'PM10', 'sec':'Agriculture'},
	        {'id':'air_29', 'cms_id': 'AIR_PM10_InternationalShipping', 'pol':'PM10', 'sec':'InternationalShipping'},
	        {'id':'air_16', 'cms_id': 'AIR_NH3_Agriculture', 'pol':'NH3', 'sec':'Agriculture'},
	        {'id':'air_17', 'cms_id': 'AIR_CO_IndustrialReleases', 'pol':'CO', 'sec':'IndustrialReleases'},
	        {'id':'air_18', 'cms_id': 'AIR_CO_NonIndustrialCombustion', 'pol':'CO', 'sec':'NonIndustrialCombustion'},
	        {'id':'air_19', 'cms_id': 'AIR_CO_RoadTransport', 'pol':'CO', 'sec':'RoadTransport'},
	        {'id':'air_20', 'cms_id': 'AIR_CO_DomesticShipping', 'pol':'CO', 'sec':'DomesticShipping'},
	        {'id':'air_21', 'cms_id': 'AIR_CO_DomesticAviation', 'pol':'CO', 'sec':'DomesticAviation'},
	        {'id':'air_30', 'cms_id': 'AIR_CO_InternationalShipping', 'pol':'CO', 'sec':'InternationalShipping'},
	        {'id':'air_22', 'cms_id': 'AIR_CO2_IndustrialReleases', 'pol':'CO2', 'sec':'IndustrialReleases'},
	        {'id':'air_23', 'cms_id': 'AIR_CO2_NonIndustrialCombustion', 'pol':'CO2', 'sec':'NonIndustrialCombustion'},
	        {'id':'air_24', 'cms_id': 'AIR_CO2_RoadTransport', 'pol':'CO2', 'sec':'RoadTransport'},
	        {'id':'air_25', 'cms_id': 'AIR_CO2_DomesticShipping', 'pol':'CO2', 'sec':'DomesticShipping'},
	        {'id':'air_26', 'cms_id': 'AIR_CO2_DomesticAviation', 'pol':'CO2', 'sec':'DomesticAviation'},
	        {'id':'air_31', 'cms_id': 'AIR_CO2_InternationalShipping', 'pol':'CO2', 'sec':'InternationalShipping'}]

})

.controller('SearchEmissionAirController', ['$scope', '$http', '$filter', 'deconf_air', 'searchFilter','emissionsService', 
                                         function($scope, $http, $filter, deconf_air, searchFilter,emissionsService) {
    
	$scope.searchFilter = searchFilter;

	$scope.diffemissionsectors = deconf_air.sectors;
	$scope.diffemissionlayers = [];//deconf.layers;
	$scope.searchFilter.sector = $scope.diffemissionsectors[0];
	
	emissionsService.get().then(function (data) {
		$scope.de = data.DiffuseSources;
	});

    $scope.$watch('searchFilter.sector', function(value) {
    	//if ($scope.searchFilter.sector !== '-'){
//        	$scope.diffemissionlayers = $filter('inSector')(deconf.layers);
        	
        	$scope.diffemissionlayers = $filter('filter')(deconf_air.layers, function (item) {
                if (item.sec === $scope.searchFilter.sector.name){
                	return true;//{'code':item.cms_id, 'name':$scope.de[item.cms_id+'.TitleShort']} ;
                }
                return false;
            });
    	//}
     });

    $scope.getTitle = function(id) {
        return $scope.de[id+'.TitleShort'];
    };
    
    
	
}])
.directive('searchAirEmission', function() {
	return {
		controller: 'SearchEmissionAirController',
		templateUrl: 'components/emission-search-filter/emission-air-search-filter.html'
	};
});
