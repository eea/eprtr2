'use strict';

angular.module('myApp.emissionmapair', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('emaconf',{
	//http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer
	//http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0
	'EPRTRDiffuseEmissionsAirUrl':'http://discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsAir_Dyna_WGS84/MapServer',
	'europebounds': [53.526, 10.667],
	'europezoom': 3,
	'dealayers':{
		'AIR_NOX_IndustrialReleases':0,
		'AIR_NOX_NonIndustrialCombustion' :1,
		'AIR_NOX_RoadTransport':2, 
		'AIR_NOX_DomesticShipping':3, 
		'AIR_NOX_DomesticAviation':4, 
		'AIR_NOX_InternationalShipping':27, 
		'AIR_SOX_IndustrialReleases':5, 
		'AIR_SOX_NonIndustrialCombustion':6, 
		'AIR_SOX_RoadTransport':7, 
		'AIR_SOX_DomesticShipping':8, 
		'AIR_SOX_DomesticAviation':9, 
		'AIR_SOX_InternationalShipping':28, 
		'AIR_PM10_IndustrialReleases':10, 
		'AIR_PM10_NonIndustrialCombustion':11, 
		'AIR_PM10_RoadTransport':12, 
		'AIR_PM10_DomesticShipping':13, 
		'AIR_PM10_DomesticAviation':14, 
		'AIR_PM10_Agriculture':15, 
		'AIR_PM10_InternationalShipping':29, 
		'AIR_NH3_Agriculture':16, 
		'AIR_CO_IndustrialReleases':17, 
		'AIR_CO_NonIndustrialCombustion':18, 
		'AIR_CO_RoadTransport':19, 
		'AIR_CO_DomesticShipping':20, 
		'AIR_CO_DomesticAviation':21, 
		'AIR_CO_InternationalShipping':30, 
		'AIR_CO2_IndustrialReleases':22, 
		'AIR_CO2_NonIndustrialCombustion':23, 
		'AIR_CO2_RoadTransport':24, 
		'AIR_CO2_DomesticShipping':25, 
		'AIR_CO2_DomesticAviation':26, 
		'AIR_CO2_InternationalShipping':31 
	}

	})

.controller('emissionMapAirController', ['$scope',  'leafletData', 'emaconf', function($scope,  leafletData, emaconf) {
	var elm_ctrl = this;
	
	$scope.setLayer = function(id){
		if(id != undefined){

			if(elm_ctrl.dmlay){
				elm_ctrl.dmlay.setLayers([emaconf.dealayers[id]]);	
			}
			else if(elm_ctrl.elm_map){
				var dmlay = elm_ctrl.elm_map.getLayer(1); 
				dmlay.setLayers([emaconf.dealayers[id]]);	
			}
		}
	};

	//Here we initialize the map
	leafletData.getMap().then(function(map) {
		//Initial extent
		map.invalidateSize();
		map.setView(emaconf.europebounds, emaconf.europezoom);
		map.attributionControl = false;
		
		elm_ctrl.elm_map = map
		
		//We set the baselayer - in version 2 we can add more baselayers and a selector
		L.esri.basemapLayer("Streets").addTo(map);

		elm_ctrl.dmlay = L.esri.dynamicMapLayer(emaconf.EPRTRDiffuseEmissionsAirUrl, {
		    opacity: 0.5,
		    useCors: false,
		    layers:[0],
		  });//.addTo(map);

		if($scope.layerid != undefined){
			elm_ctrl.dmlay.layers = [emaconf.dealayers[$scope.layerid]];	
		}
		elm_ctrl.dmlay.addTo(map); 

	});
	
	
}])

/*
 * This directive enables us to define this module as a custom HTML element
 * <esri-leaf-map queryparams="" /> 
 * You can use only one of these parameters: 
 *    facility-report-id: Interesting in the facilitydetails view where we only focus on one facility
 *    wherestr: This has given me some problems because Angular wants to pass the string as an expression
 *    queryparams: a JSON oject with key, value pairs eg. {"ReportingYear":2008, "CountryCode":"NL"}    
 * */
.directive('emissionMapAir', function() {
	return {
		restrict: 'E',
		controller: 'emissionMapAirController',
        transclude: true,
		scope: {
			layerid: '='
		},
		templateUrl: 'components/esrileafmap/emissionmapair.html',
		link: function(scope, element, attrs){
			scope.$watch('layerid', function() {
				if(scope.layerid !== undefined){
					scope.setLayer(scope.layerid);
				}
		    },true);
		}
	};
});