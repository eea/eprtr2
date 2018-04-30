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

.controller('emissionMapWaterController', ['$scope', '$http', 'leafletData', 'emwconf','eprtrmaps', function($scope, $http, leafletData, emwconf,eprtrmaps) {
	var elm_ctrl = this;
	$scope.legenddef = {};
	
	$scope.setLayer = function(id){
		if(id != undefined){
			elm_ctrl._layid = emwconf.dealayers[id]; 
			if(elm_ctrl.dmlay){
				elm_ctrl.dmlay.setLayers([emwconf.dealayers[id]]);	
			}
			else if(elm_ctrl.elm_map){
				var dmlay = elm_ctrl.elm_map.getLayer(1); 
				dmlay.setLayers([emwconf.dealayers[id]]);	
			}
			elm_ctrl.legend.update();
		}
	};
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});

	$scope.getLegenddef = function(){
		$http.get($scope.mapurls.emissionwaterUrl+'/legend?f=pjson').success(function(data, status) {
			$scope.legenddef = data;
		});
	}
	
	$scope.$watch('mapurls', function() {
        var maxBounds = L.latLngBounds(new L.LatLng(-60, -170), new L.LatLng(85, 179));

		if($scope.mapurls){
			$scope.getLegenddef();

			//Here we initialize the map
			leafletData.getMap().then(function(map) {
				//Initial extent
				map.invalidateSize();
                map.setMaxBounds(maxBounds);
				map.setView(emwconf.europebounds, emwconf.europezoom);
				map.attributionControl = false;
				
				elm_ctrl.elm_map = map
				
				//We set the baselayer - in version 2 we can add more baselayers and a selector
				L.esri.basemapLayer("Streets").addTo(map);
		
				elm_ctrl.dmlay = L.esri.dynamicMapLayer({
					url: $scope.mapurls.emissionwaterUrl, 
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
		
				$scope.createLegend();
		
				$scope.toggleLegend = L.easyButton({
					  states: [{
					    stateName: 'show-legend',
					    icon: 'fa-bars',
					    title: 'show legend',
					    onClick: function(control) {
					    	if(elm_ctrl.legend != undefined){
					    		elm_ctrl.legend.addTo(elm_ctrl.elm_map);
					    		control.state('hide-legend');
					    	}
					    }
					  }, {
					    icon: 'fa-bars',
					    stateName: 'hide-legend',
					    onClick: function(control) {
					    	if(elm_ctrl.legend != undefined){
						      elm_ctrl.elm_map.removeControl(elm_ctrl.legend);
						      control.state('show-legend');
					    	}
					    },
					    title: 'hide legend'
					  }]
					});
				$scope.toggleLegend.addTo(elm_ctrl.elm_map);
		
			});
		}
	});

	
	$scope.redraw = function(){
		if(elm_ctrl.elm_map){
			window.setTimeout(function(){elm_ctrl.elm_map.invalidateSize();}, 600)
		}
	};

	$scope.createLegend = function(){

		elm_ctrl.legend = L.control({position: 'bottomright'});
		
		elm_ctrl.legend.onAdd = function (map) {
			elm_ctrl.legend._div = L.DomUtil.create('div', 'leaflet-control-layers legend');
			elm_ctrl.legend.update();
		    return elm_ctrl.legend._div;
		}

		elm_ctrl.legend.update = function(){
			var layerdef = [];
			angular.forEach($scope.legenddef.layers, function(item) {
				if (item.layerId.toString() == elm_ctrl._layid){
					elm_ctrl.legend._div.innerHTML = '<h4>'+item.layerName+'</h4>';
				    angular.forEach(item.legend, function(leg) {
				    	var _url = $scope.mapurls.emissionwaterUrl + '/0/images/' + leg.url;
				    	//<img style="-webkit-user-select: none" src="http://test.discomap.eea.europa.eu/arcgis/rest/services/AIR/EPRTRDiffuseEmissionsWater/MapServer/0/images/7f34224c77c077f1d419c50fac65e787">
				    	elm_ctrl.legend._div.innerHTML += '<img src="'+_url+'" style="width:'+leg.width+';height:'+leg.height+';" > ' + leg.label + '<br>';
				    });
				}
			});
		}
		//Need to create first time
		elm_ctrl.legend.addTo(elm_ctrl.elm_map);

		//Hide again
        elm_ctrl.elm_map.removeControl(elm_ctrl.legend);

	};

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
			layerid: '=', 
			control: '='
		},
		templateUrl: 'components/esrileafmap/emissionmapwater.html',
		link: function(scope, element, attrs){
			scope.$watch('layerid', function() {
				if(scope.layerid !== undefined){
					scope.setLayer(scope.layerid);
				}
		    },true);
			 scope.internalControl = scope.control || {};
			 scope.internalControl.redraw = function() {
				scope.redraw();
		    };
		 }
	};
});