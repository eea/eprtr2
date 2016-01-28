'use strict';

angular.module('myApp.emissionmapair', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('emaconf',{
	//http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer
	//http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0
	'EPRTRDiffuseEmissionsAirUrl':'http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsAir_Dyna_WGS84/MapServer',
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

.controller('emissionMapAirController', ['$scope', '$http',  'leafletData', 'emaconf', 'eprtrmaps', function($scope, $http, leafletData, emaconf,eprtrmaps) {
	var elm_ctrl = this;
	
	$scope.legenddef = {};
	$scope.setLayer = function(id){
		if(id != undefined){
			elm_ctrl._layid = emaconf.dealayers[id]; 
			if(elm_ctrl.dmlay){
				elm_ctrl.dmlay.setLayers([elm_ctrl._layid]);	
			}
			else if(elm_ctrl.elm_map){
				var dmlay = elm_ctrl.elm_map.getLayer(1); 
				dmlay.setLayers([elm_ctrl._layid]);	
			}
			elm_ctrl.legend.update();
		}
	};
	$scope.getLegenddef = function(){
		$http.get($scope.mapurls.emissionairUrl+'/legend?f=pjson').success(function(data, status) {
			$scope.legenddef = data;
		});
	}
	
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});

	$scope.$watch('mapurls', function() {
		if($scope.mapurls){

			$scope.getLegenddef();
			//Here we initialize the map
			leafletData.getMap().then(function(map) {
				//Initial extent
				map.invalidateSize();
				map.setView(emaconf.europebounds, emaconf.europezoom);
				map.attributionControl = false;
				
				elm_ctrl.elm_map = map
				
				//We set the baselayer - in version 2 we can add more baselayers and a selector
				L.esri.basemapLayer("Streets").addTo(map);
		
				elm_ctrl.dmlay = L.esri.dynamicMapLayer({
					url:$scope.mapurls.emissionairUrl, 
				    opacity: 0.5,
				    useCors: false,
				    layers:[0],
					f: 'image'
				  });//.addTo(map);
		
				if($scope.layerid != undefined){
					elm_ctrl.dmlay.layers = [emaconf.dealayers[$scope.layerid]];	
				}
				elm_ctrl.dmlay.addTo(map);
				
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
				    	var _url = $scope.mapurls.emissionairUrl + '/0/images/' + leg.url;
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

	}
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
			layerid: '=', 
			control: '='
		},
		templateUrl: 'components/esrileafmap/emissionmapair.html',
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