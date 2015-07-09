'use strict';

angular.module('myApp.emissionmapwater', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('emwconf',{
	//http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer
	//http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0
	'EPRTRDiffuseEmissionsWaterUrl':'http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsWater/MapServer',
	'europebounds': [53.526, 10.667],
	'europezoom': 3,
	'dealayers':{
		'WATER_N_AtmosphericDeposition':0, 
		'WATER_CD_AtmosphericDeposition':1, 
		'WATER_PB_AtmosphericDeposition':2,
		'WATER_HG_AtmosphericDeposition':3,
		'WATER_P_Agriculture':4,
		'WATER_N_Agriculture':5,
		'WATER_CD_Transport':6,
		'WATER_PB_Transport':7,
		'WATER_NI_Transport':8,
		'WATER_ANTHRACENE_Transport':9,
		'WATER_FLUORANTHENE_Transport':10,
		'WATER_CO_Transport':11,
		'WATER_ZN_Transport':12,
		'WATER_TOC_UWWTP':13,
		'WATER_P_UWWTP':14,
		'WATER_N_UWWTP':15,
		'WATER_CD_UWWTP':16,
		'WATER_PB_UWWTP':17,
		'WATER_HG_UWWTP':18,
		'WATER_NI_UWWTP':19,
		'WATER_ANTHRACENE_UWWTP':20,
		'WATER_FLUORANTHENE_UWWTP':21,
		'WATER_CO_UWWTP':22,
		'WATER_ZN_UWWTP':23,
		'WATER_TOC_UnconnectedHouseholds':24,
		'WATER_P_UnconnectedHouseholds':25,
		'WATER_N_UnconnectedHouseholds':26,
		'WATER_CD_UnconnectedHouseholds':27,
		'WATER_PB_UnconnectedHouseholds':28,
		'WATER_HG_UnconnectedHouseholds':29,
		'WATER_NI_UnconnectedHouseholds':30,
		'WATER_ANTHRACENE_UnconnectedHouseholds':31,
		'WATER_FLUORANTHENE_UnconnectedHouseholds':32,
		'WATER_CO_UnconnectedHouseholds':33,
		'WATER_ZN_UnconnectedHouseholds':34,
		'WATER_TOC_InlandNavigation':35,
		'WATER_P_InlandNavigation':36,
		'WATER_N_InlandNavigation':37,
		'WATER_ANTHRACENE_InlandNavigation':38,
		'WATER_FLUORANTHENE_InlandNavigation':39
		}
	})

.controller('emissionMapWaterController', ['$scope',  'leafletData', 'emwconf', function($scope,  leafletData, emwconf) {
	var elm_ctrl = this;
	
	$scope.setLayer = function(id){
		if(id != undefined){

			if(elm_ctrl.dmlay){
				elm_ctrl.dmlay.setLayers([emwconf.dealayers[id]]);	
			}
			else if(elm_ctrl.elm_map){
				var dmlay = elm_ctrl.elm_map.getLayer(1); 
				dmlay.setLayers([emwconf.dealayers[id]]);	
			}
		}
	};

	//Here we initialize the map
	leafletData.getMap().then(function(map) {
		//Initial extent
		map.invalidateSize();
		map.setView(emwconf.europebounds, emwconf.europezoom);
		map.attributionControl = false;
		
		elm_ctrl.elm_map = map
		
		//We set the baselayer - in version 2 we can add more baselayers and a selector
		L.esri.basemapLayer("Streets").addTo(map);

		elm_ctrl.dmlay = L.esri.dynamicMapLayer(emwconf.EPRTRDiffuseEmissionsWaterUrl, {
		    opacity: 0.5,
		    useCors: false,
		    layers:[0],
			f: 'image'
		  });//.addTo(map);

		if($scope.layerid != undefined){
			elm_ctrl.dmlay.layers = [emwconf.dealayers[$scope.layerid]];	
		}
		elm_ctrl.dmlay.addTo(map); 

		elm_ctrl.dmlay.bindPopup(function (error, featureCollection) {
		    if(error || featureCollection.features.length === 0) {
		      return false;
		    } else {
		    	var keys = Object.keys(featureCollection.features[0].properties);
		    	var _str = '<p><em>'+keys[3]+'</em>: '+featureCollection.features[0].properties[keys[3]]+'<br>';
		    	_str += '<em>'+keys[4]+'</em>: '+featureCollection.features[0].properties[keys[4]]+'<br>';
		    	_str += '<em>'+keys[5]+'</em>: '+featureCollection.features[0].properties[keys[5]]+'<br>';
		    	_str += '<em>'+keys[6]+'</em>: '+featureCollection.features[0].properties[keys[6]]+'<br>';
		    	_str += '<em>'+keys[7]+'</em>: '+featureCollection.features[0].properties[keys[7]]+'<br>';
		    	_str += '<em>'+keys[8]+'</em>: '+featureCollection.features[0].properties[keys[8]]+'<br>';
		    	_str += '<em>'+keys[9]+'</em>: '+featureCollection.features[0].properties[keys[9]]+'</p>';
		    	//, feature.properties
        	    return _str;//L.Util.template(_str, featureCollection.features[0].properties);

		    }
		  });
		
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
.directive('emissionMapWater', function() {
	return {
		restrict: 'E',
		controller: 'emissionMapWaterController',
        transclude: true,
		scope: {
			layerid: '='
		},
		templateUrl: 'components/esrileafmap/emissionmapwater.html',
		link: function(scope, element, attrs){
			scope.$watch('layerid', function() {
				if(scope.layerid !== undefined){
					scope.setLayer(scope.layerid);
				}
		    },true);
		}
	};
});