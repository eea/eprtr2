'use strict';

angular.module('myApp.esrileafmap', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('elmconf',{
	'eprtrLayerUrl':'http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0',
	'europebounds': [53.526, 10.667],
	'passInFilter': ['offset','limit','order','desc'],
	'sectors':['0','1','2','3','4','5','6','7','8','9']
	})

.controller('esriLeafMapController', ['$scope',  'leafletData','elmconf', function($scope,  leafletData, elmconf) {
	var elm_ctrl = this;
	var points = [];
	var where = '';
	
	/*
	 * We extend scope with a collection of icons and two functions
	 * Icons uses the Leaflet.awsome-markers plugin
	 * SetWhere function is called when the query parameters are changed after load
	 * buildWhere function is called when we want to parse the query parameters into a where string
	 * */
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
		setwhere: function(where_str){
			//console.log('setWhere: ' + where_str);
			if ($scope.where != where_str){
				$scope.where = where_str;
				if(elm_ctrl.fdlay){
					elm_ctrl.fdlay.setWhere(where_str);
					//console.log('elm_ctrl.fdlay: True');
				}
				else if(elm_ctrl.elm_map){
					var fdlay = elm_ctrl.elm_map.getLayer(1); 
					fdlay.setWhere(where_str);
				}
				else {
					$scope.where = where_str;
				}			
			};
		},
	    buildWhere: function(queryparams) {
	    	var arrQue = []
	    	for (var key in queryparams){
	    		if (elmconf.passInFilter.indexOf(key)<0){
	        		var qstr = ""
	        		if (queryparams[key] && queryparams[key] != ''){
		        		if (typeof queryparams[key] === 'number'){
		        			qstr = 	key + "=" + queryparams[key];
		        		}
		        		else {        			
		        			qstr = 	key + "='" + queryparams[key] + "'";
		        		}	
		        		arrQue.push(qstr);
	        		}
	    		}
	    	}
	    	return (arrQue.length > 0)?arrQue.join(" AND "):" ";
	    },
	});
	
	/*
	 * if the where string is empty or undefined then we build it 
	 */
    if (!$scope.where || $scope.where === '' ){
        if ($scope.queryparams){
        	$scope.where = $scope.buildWhere($scope.queryparams);
        }
        else if ($scope.wherestr){
        	$scope.where = $scope.wherestr
        }
        else if ($scope.frid){
        	$scope.where = "FacilityReportID=" + $scope.frid;
        }
        else {
        	$scope.where = " ";
        }
    };

    //Internal function to filter min and max coordinates
	$scope.getMinOrMax = function (feature, minOrMax, latOrLng) {
		  return _[minOrMax](feature, function (value) {
		      return value[latOrLng] 
		  })[latOrLng];
		};
	
	//Internal function for updating the map extent - still not satisfied 
	$scope.updateExtent = function(features) {
		  var maxLat = $scope.getMinOrMax(features, "max", "lat");
		  var minLat = $scope.getMinOrMax(features, "min", "lat");
		  var maxLng = $scope.getMinOrMax(features, "max", "lng");
		  var minLng = $scope.getMinOrMax(features, "min", "lng");
		  //console.log('maxLat: ' + maxLat + ', minLat: ' + minLat + ', maxLng: ' + maxLng + ', minLng: ' + minLng);
		  var southWest = new L.LatLng(minLat, minLng);
		  var northEast = new L.LatLng(maxLat, maxLng);
		  return new L.LatLngBounds(southWest, northEast);	
	};

	//Here we initialize the map
	leafletData.getMap().then(function(map) {
		//Initial extent
		map.setView(elmconf.europebounds, 4);
		elm_ctrl.elm_map = map
		//We set the baselayer - in version 2 we can add more baselayers and a selector
		L.esri.basemapLayer("Streets").addTo(map);

		//Here we define the Clustered Feature Service layer
		elm_ctrl.fdlay = L.esri.clusteredFeatureLayer(elmconf.eprtrLayerUrl, {
			spiderfyOnMaxZoom:false,
		    disableClusteringAtZoom: 9,
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
			   var sec = geojson.properties.IASectorCode.toLowerCase();
			   return L.marker(latlng, {
			        icon: $scope.eprtricons[(elmconf.sectors.indexOf(sec)>0)?sec:'others']
			      });
		    },
		});

		//Here we try to navigate to the extent of the selected features - still not satisfied
		elm_ctrl.fdlay.on('load', function(e){
//			console.log('pnts: '+ points.length);
			if (points.length > 0){
				var bounds = $scope.updateExtent(points);
	//			console.log('Once: '+ bounds.toBBoxString());
	  		    map.fitBounds(bounds,{maxZoom:3});
	  		    points = [];
			};
//  		    map.fitBounds(bounds,{maxZoom:2});
			  // do something on load
		});
		//Now we add the clusterlayer to the map
		elm_ctrl.fdlay.addTo(map);

		//Here we bind a HTML template to the the popup - TODO 
		elm_ctrl.fdlay.bindPopup(function (feature) {
				//console.log('pop: '+ feature.properties.X + ' ' + feature.properties.Y);
        	    return L.Util.template('<p>{FacilityName }<br>{ReportingYear }<br>{CountryCode }</p>', feature.properties);
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
.directive('esriLeafMap', function() {
	return {
		restrict: 'E',
		controller: 'esriLeafMapController',
        transclude: true,
		scope: {
			frid: '@facilityReportId',
			wherestr: '=',
			queryparams: '='//,
		},
		templateUrl: 'components/esrileafmap/esrileafmap.html',
		link: function(scope, element, attrs){
			scope.$watch('queryparams', function() {
	        	scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);
		}
	};
});