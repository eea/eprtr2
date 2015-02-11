'use strict';

angular.module('myApp.esrileafmap', ['ngRoute','leaflet-directive'])

/*.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/esrileafmap', {
    templateUrl: 'components/esrileafmap/esrileafmap.html',
    controller: 'esriLeafMapController'
  });
}])*/


.controller('esriLeafMapController', ['$scope', 'leafletData', function($scope, leafletData) {
	var elm_ctrl = this;
	
	angular.extend($scope, {
		eprtrLayerUrl: 'http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0',
		europebounds: [53.526, 10.667] /*new L.LatLngBounds([50,1], [60,10])*/,
		where: '',
		setWhere: function(where_str){
			if (elm_ctrl.elm_map){
				var fdlay = elm_ctrl.elm_map.getLayer(1); 
				fdlay.setWhere(where_str);
				$scope.fitToBounds(fdlay.getLayers())
			}
			else {
				$scope.where = where_str;
			}
		},
	});
    
	$scope.where = $scope.where ? $scope.where : "FacilityReportID = " + $scope.frid; 
	
	$scope.getMinOrMax = function (feature, minOrMax, latOrLng) {
		  return _[minOrMax](feature, function (value) {
		    if (value.marker) {
		      var latLng = value.marker.getLatLng();
		      return latLng[latOrLng] 
		    }
		  })[latOrLng];
		};
	
	$scope.updateExtent = function(features) {
		  var maxLat = $scope.getMinOrMax(features, "max", "lat");
		  var minLat = $scope.getMinOrMax(features, "min", "lat");
		  var maxLng = $scope.getMinOrMax(features, "max", "lng");
		  var minLng = $scope.getMinOrMax(features, "min", "lng");
		  var southWest = new L.LatLng(minLat, minLng);
		  var northEast = new L.LatLng(maxLat, maxLng);
		  return new L.LatLngBounds(southWest, northEast);	
	};

	$scope.fitToBounds = function (features) {
		  var bounds = $scope.updateExtent(features);
		  elm_map.fitBounds(bounds,{maxZoom:8});
  	};
	
	leafletData.getMap().then(function(map) {
		map.setView($scope.europebounds, 4);
		elm_ctrl.elm_map = map
		L.esri.basemapLayer("Streets").addTo(map);
		elm_ctrl.fdlay = L.esri.featureLayer($scope.eprtrLayerUrl, {
  		   where: $scope.where,
  		   name : "E-PRTR Facilities",
		   pointToLayer: function (geojson, latlng) {
		      return  L.circleMarker(latlng, {
		          color: '#5B7CBA',
		          weight: 2,
		          opacity: 0.85,
		          fillOpacity: 0.5
		        }); 
		    },
		  });
        	
		elm_ctrl.fdlay.addTo(map);

		elm_ctrl.fdlay.bindPopup(function (feature) {
        	    return L.Util.template('<p>{FacilityName }<br>{ReportingYear }<br>{CountryCode }</p>', feature.properties);
        	  });

		//$scope.fitToBounds(elm_ctrl.fdlay.getLayers())
	});
	
}])

.directive('esriLeafMap', function() {
	return {
		restrict: 'AE',
		controller: 'esriLeafMapController',
        transclude: true,
		scope: {frid: '@facilityReportId'},
		templateUrl: 'components/esrileafmap/esrileafmap.html',
		link: function(scope, element, attrs){
		}
	};
});