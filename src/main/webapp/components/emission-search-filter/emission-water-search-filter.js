'use strict';

angular.module('myApp.emission-water-search-filter', ['myApp.home', 'myApp.search-filter'])

.constant('deconf_water',{
	sectors:[
	        {'code':'-','name':'Select Sector'},
			{'code':'SECTOR_CODE_ATMOSPHERIC_DEPOSITION','name':'AtmosphericDeposition'}, 			
			{'code':'SECTOR_CODE_AGRICULTURE','name':'Agriculture'}, 			
			{'code':'SECTOR_CODE_TRANSPORT','name':'Transport'}, 			
			{'code':'SECTOR_CODE_UWWTP','name':'UWWTP'}, 			
			{'code':'SECTOR_CODE_UN-CONNECTED_HOUSEHOLDS','name':'Un-connectedHouseholds'}, 			
			{'code':'SECTOR_CODE_INLAND_NAVIGATION','name':'InlandNavigation'}
	],
	layers:[{'id':'water_1', 'cms_id': 'WATER_N_AtmosphericDeposition', 'pol':'N', 'sec':'AtmosphericDeposition'},
	        {'id':'water_2', 'cms_id': 'WATER_CD_AtmosphericDeposition', 'pol':'CD', 'sec':'AtmosphericDeposition'},
	        {'id':'water_3', 'cms_id': 'WATER_PB_AtmosphericDeposition', 'pol':'PB', 'sec':'AtmosphericDeposition'},
	        {'id':'water_4', 'cms_id': 'WATER_HG_AtmosphericDeposition', 'pol':'HG', 'sec':'DomesticAviation'},
	        {'id':'water_5', 'cms_id': 'WATER_P_Agriculture', 'pol':'P', 'sec':'Agriculture'},
	        {'id':'water_6', 'cms_id': 'WATER_N_Agriculture', 'pol':'N', 'sec':'Agriculture'},
	        {'id':'water_7', 'cms_id': 'WATER_CD_Transport', 'pol':'CD', 'sec':'Transport'},
	        {'id':'water_8', 'cms_id': 'WATER_PB_Transport', 'pol':'PB', 'sec':'Transport'},
	        {'id':'water_9', 'cms_id': 'WATER_NI_Transport', 'pol':'NI', 'sec':'Transport'},
	        {'id':'water_10', 'cms_id': 'WATER_ANTHRACENE_Transport', 'pol':'Anthracene', 'sec':'Transport'},
	        {'id':'water_11', 'cms_id': 'WATER_FLUORANTHENE_Transport', 'pol':'Fluoranthene', 'sec':'Transport'},
	        {'id':'water_12', 'cms_id': 'WATER_CO_Transport', 'pol':'CO', 'sec':'Transport'},
	        {'id':'water_13', 'cms_id': 'WATER_ZN_Transport', 'pol':'ZN', 'sec':'Transport'},
	        {'id':'water_14', 'cms_id': 'WATER_TOC_UWWTP', 'pol':'TOC', 'sec':'UWWTP'},
	        {'id':'water_15', 'cms_id': 'WATER_P_UWWTP', 'pol':'P', 'sec':'UWWTP'},
	        {'id':'water_16', 'cms_id': 'WATER_N_UWWTP', 'pol':'N', 'sec':'UWWTP'},
	        {'id':'water_17', 'cms_id': 'WATER_CD_UWWTP', 'pol':'CD', 'sec':'UWWTP'},
	        {'id':'water_18', 'cms_id': 'WATER_PB_UWWTP', 'pol':'PB', 'sec':'UWWTP'},
	        {'id':'water_19', 'cms_id': 'WATER_HG_UWWTP', 'pol':'HG', 'sec':'UWWTP'},
	        {'id':'water_20', 'cms_id': 'WATER_NI_UWWTP', 'pol':'NI', 'sec':'UWWTP'},
	        {'id':'water_21', 'cms_id': 'WATER_ANTHRACENE_UWWTP', 'pol':'ANTHRACENE', 'sec':'UWWTP'},
	        {'id':'water_22', 'cms_id': 'WATER_FLUORANTHENE_UWWTP', 'pol':'FLUORANTHENE', 'sec':'UWWTP'},
	        {'id':'water_23', 'cms_id': 'WATER_CO_UWWTP', 'pol':'CO', 'sec':'UWWTP'},
	        {'id':'water_24', 'cms_id': 'WATER_ZN_UWWTP', 'pol':'ZN', 'sec':'UWWTP'},
	        {'id':'water_25', 'cms_id': 'WATER_TOC_UnconnectedHouseholds', 'pol':'TOC', 'sec':'Un-connectedHouseholds'},
	        {'id':'water_26', 'cms_id': 'WATER_P_UnconnectedHouseholds', 'pol':'P', 'sec':'Un-connectedHouseholds'},
	        {'id':'water_27', 'cms_id': 'WATER_N_UnconnectedHouseholds', 'pol':'N', 'sec':'Un-connectedHouseholds'},
	        {'id':'water_28', 'cms_id': 'WATER_CD_UnconnectedHouseholds', 'pol':'CD', 'sec':'Un-connectedHouseholds'},
	        {'id':'water_29', 'cms_id': 'WATER_PB_UnconnectedHouseholds', 'pol':'PB', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_30', 'cms_id': 'WATER_HG_UnconnectedHouseholds', 'pol':'HG', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_31', 'cms_id': 'WATER_NI_UnconnectedHouseholds', 'pol':'NI', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_32', 'cms_id': 'WATER_ANTHRACENE_UnconnectedHouseholds', 'pol':'Anthracene', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_33', 'cms_id': 'WATER_FLUORANTHENE_UnconnectedHouseholds', 'pol':'Fluoranthene', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_34', 'cms_id': 'WATER_CO_UnconnectedHouseholds', 'pol':'CO', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_35', 'cms_id': 'WATER_ZN_UnconnectedHouseholds', 'pol':'ZN', 'sec':'Un-connectedHouseholds'},
	        {'id':'Water_36', 'cms_id': 'WATER_TOC_InlandNavigation', 'pol':'TOC', 'sec':'InlandNavigation'},
	        {'id':'Water_37', 'cms_id': 'WATER_P_InlandNavigation', 'pol':'P', 'sec':'InlandNavigation'},
	        {'id':'Water_38', 'cms_id': 'WATER_N_InlandNavigation', 'pol':'N', 'sec':'InlandNavigation'},
	        {'id':'Water_39', 'cms_id': 'WATER_ANTHRACENE_InlandNavigation', 'pol':'Anthracene', 'sec':'InlandNavigation'},
	        {'id':'water_40', 'cms_id': 'WATER_FLUORANTHENE_InlandNavigation', 'pol':'Fluoranthene', 'sec':'InlandNavigation'}]

})

.controller('SearchEmissionWaterController', ['$scope', '$http', '$filter', 'deconf_water', 'searchFilter','emissionsService', 
                                         function($scope, $http, $filter, deconf_water, searchFilter,emissionsService) {
    
	$scope.searchFilter = searchFilter;

	$scope.diffemissionsectors = deconf_water.sectors;
	$scope.diffemissionlayers = [];//deconf.layers;
	$scope.searchFilter.sector = $scope.diffemissionsectors[0];
	
	emissionsService.get().then(function (data) {
		$scope.de = data.DiffuseSources;
	});

    $scope.$watch('searchFilter.sector', function(value) {
    	//if ($scope.searchFilter.sector !== '-'){
//        	$scope.diffemissionlayers = $filter('inSector')(deconf.layers);
        	
        	$scope.diffemissionlayers = $filter('filter')(deconf_water.layers, function (item) {
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
.directive('searchWaterEmission', function() {
	return {
		controller: 'SearchEmissionWaterController',
		templateUrl: 'components/emission-search-filter/emission-water-search-filter.html'
	};
});
