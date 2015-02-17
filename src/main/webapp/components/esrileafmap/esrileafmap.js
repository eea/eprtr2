'use strict';

angular.module('myApp.esrileafmap', ['ngRoute','leaflet-directive'])
.constant('elmconf',{
	'eprtrLayerUrl':'http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0',
	'europebounds': [53.526, 10.667]}
	)
/*.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/esrileafmap', {
    templateUrl: 'components/esrileafmap/esrileafmap.html',
    controller: 'esriLeafMapController'
  });
}])*/


.controller('esriLeafMapController', ['$scope', 'leafletData','elmconf', function($scope, leafletData, elmconf) {
	var elm_ctrl = this;
	var points = [];
	
	angular.extend($scope, {
		
		//icon: L.AwesomeMarkers.icon({icon: 'spinner', prefix: 'fa', markerColor: 'red', spin:true}) }).addTo(map);
		eprtricons: {
				/*IASectorCode*/
				1: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkgreen'}),
				2: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'blue'}),
				3: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'orange'}),
				4: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'cadetblue'}),
				5: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'green'}),
				6: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkpuple'}),
				7: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkred'}),
				8: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'red'}),
				9: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'purple'}),
				others: L.AwesomeMarkers.icon({
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'red'})
   	    },
		where: '',
		setWhere: function(where_str){
			if (elm_ctrl.elm_map){
				var fdlay = elm_ctrl.elm_map.getLayer(1); 
				fdlay.setWhere(where_str);
				//$scope.fitToBounds(fdlay.getLayers())
			}
			else {
				$scope.where = where_str;
			}
		},
	});
    
//	$scope.where = $scope.where ? $scope.where : "FacilityReportID=" + $scope.frid; 
	$scope.where = "CountryCode='NL' AND ReportingYear=2007" //+ $scope.frid; 
	
	$scope.getMinOrMax = function (feature, minOrMax, latOrLng) {
		  return _[minOrMax](feature, function (value) {
		      return value[latOrLng] 
		  })[latOrLng];
		};
	
	$scope.updateExtent = function(features) {
		  var maxLat = $scope.getMinOrMax(features, "max", "lat");
		  var minLat = $scope.getMinOrMax(features, "min", "lat");
		  var maxLng = $scope.getMinOrMax(features, "max", "lng");
		  var minLng = $scope.getMinOrMax(features, "min", "lng");
		  console.log('maxLat: ' + maxLat + ', minLat: ' + minLat + ', maxLng: ' + maxLng + ', minLng: ' + minLng);
		  var southWest = new L.LatLng(minLat, minLng);
		  var northEast = new L.LatLng(maxLat, maxLng);
		  return new L.LatLngBounds(southWest, northEast);	
	};

/*	$scope.fitToBounds = function (features) {
		  var bounds = $scope.updateExtent(features);
		  elm_map.fitBounds(bounds,{maxZoom:8});
  	};*/
	
	leafletData.getMap().then(function(map) {
		map.setView(elmconf.europebounds, 4);
		elm_ctrl.elm_map = map
		L.esri.basemapLayer("Streets").addTo(map);

		console.log('Que: ' + $scope.where);
/*		var que = L.esri.Tasks.query({
			url: elmconf.eprtrLayerUrl2,
			where: $scope.where
		});
		que.count(function(error, count, response){
		    console.log('Found ' + count + ' features');
		});
		que.bounds(function(error, latLngBounds, response){
		    map.fitBounds(latLngBounds);
		});*/
		
		elm_ctrl.fdlay = L.esri.clusteredFeatureLayer(elmconf.eprtrLayerUrl, {
			spiderfyOnMaxZoom:false,
		    disableClusteringAtZoom: 12,
		    polygonOptions: {
		      color: '#2d84c8',
		      weight: 4,
		      opacity: 1,
		      fillOpacity: 0.5
		    },
   		   	iconCreateFunction: function(cluster) {
  		      // get the number of items in the cluster
  		      var count = cluster.getChildCount();

  		      // figure out how many digits long the number is
  		      var digits = (count+'').length;

  		      // return a new L.DivIcon with our classes so we can
  		      // style them with CSS. Take a look at the CSS in
  		      // the <head> to see these styles. You have to set
  		      // iconSize to null if you want to use CSS to set the
  		      // width and height.
  		      return new L.DivIcon({
  		        html: count,
  		        className:'cluster digits-'+digits,
  		        iconSize: null
  		      });
  		    },
   		   	where: $scope.where,
   		   	name: "E-PRTR Facilities",
		    pointToLayer: function (geojson, latlng) {
			   points.push(latlng)
			   return L.marker(latlng, {
			        icon: $scope.eprtricons[geojson.properties.IASectorCode.toLowerCase()]
			      });
		    },
		});

		elm_ctrl.fdlay.addTo(map);

		elm_ctrl.fdlay.once('load', function(e){
			console.log('pnts: '+ points.length);
			if (points.length > 0){
				var bounds = $scope.updateExtent(points);
				console.log('Once: '+ bounds.toString());
	  		    map.panTo(bounds);
			};
//  		    map.fitBounds(bounds,{maxZoom:2});
			  // do something on load
		});
		
		elm_ctrl.fdlay.on('load', function(e){
			console.log('pnts: '+ points.length);
			if (points.length > 0){
				var bounds = $scope.updateExtent(points);
				console.log('Once: '+ bounds.toString());
//	  		    map.panTo(bounds);
			};
//  		    map.fitBounds(bounds,{maxZoom:2});
			  // do something on load
		});

/*		elm_ctrl.fdlay.query().bounds(function(error, latLngBounds, response){
			console.log('que: '+ latLngBounds.getCenter());
		});*/


		elm_ctrl.fdlay.bindPopup(function (feature) {
				//console.log('pop: '+ feature.properties.X + ' ' + feature.properties.Y);
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