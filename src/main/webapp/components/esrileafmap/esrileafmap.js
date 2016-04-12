'use strict';

angular.module('myApp.esrileafmap', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('elmconf',{
	//http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer
	//http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0
	'eprtrLayerUrl':'http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer/0',
	'europebounds': [53.526, 10.667],
	'europezoom': 3,
	'passInFilter': ['FacilityReportID','FacilityName','FacilityID','NationalID',
	                 'ParentCompanyName','ReportingYear','Address','City','PostalCode',
	                 'CountryCode','LOV_CountryID','RiverBasinDistrictCode','LOV_RiverBasinDistrictID',
	                 'NUTSLevel2RegionCode','LOV_NUTSRLevel1ID','LOV_NUTSRLevel2ID','LOV_NUTSRLevel3ID',
	                 'IASectorCode','IAActivityCode','IASubActivityCode','IPPCSectorCode','IPPCActivityCode',
	                 'IPPCSubActivityCode','LOV_IASectorID','LOV_IAActivityID','LOV_IASubActivityID',
	                 'NACESectorCode','NACEActivityCode','NACESubActivityCode','LOV_NACESectorID',
	                 'LOV_NACEActivityID','LOV_NACESubActivityID','IAReportedActivityCode',
	                 'IPPCReportedActivityCode','NACEReportedActivityCode',
	                 'ConfidentialCode','LOV_ConfidentialityID'],
	'sectors':['0','1','2','3','4','5','6','7','8','9'],
	'defquery':'ReportingYear=2012',
	'contenttypes':{
		'pollutantrelease':'dbo.pollutantrelease',
		'pollutanttransfer':'dbo.pollutanttransfer',
		'wastetransfer':'dbo.wastetransfer',
		'facilitylevel':'dbo.FACILITYSEARCH_ALL'}

	})

.controller('esriLeafMapController', ['$scope',  'leafletData', 'elmconf', 'eprtrcms', 'eprtrmaps', function($scope,  leafletData, elmconf, eprtrcms, eprtrmaps) {
	var elm_ctrl = this;
	var points = [];
	$scope.showlegend = false;
	var where = '';

	eprtrcms.get('LOV_ANNEXIACTIVITY',null).then(function (data) {
		$scope.tr_laa = data;
	});

	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});
	
	$scope.$watchCollection('[lov,elm_ctrl]', function(value){
    	if($scope.lov && elm_ctrl.elm_map){
    		$scope.createLegend();
    	}
    });
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
				1: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkgreen'},
				2: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'blue'},
				3: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'orange'},
				4: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'cadetblue'},
				5: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'green'},
				6: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkpuple'},
				7: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'darkred'},
				8: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'red'},
				9: {
					icon: 'star', 
					prefix: 'fa', 
					markerColor: 'purple'},
				others: {
					icon: 'home', 
					prefix: 'fa', 
					markerColor: 'red'}
   	    },
   	    eprtriconcolors:{
   	    	'red':'#D63E2A', 
   	    	'darkred':'#A23336', 
   	    	'orange':'#F69730', 
   	    	'green':'#72B026', 
   	    	'darkgreen':'#728224', 
   	    	'blue':'#38AADD', 
   	    	'purple':'#D252B9', 
   	    	'darkpuple':'#5B396B', 
   	    	'cadetblue':'#436978'
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
	    		if (elmconf.passInFilter.indexOf(key)>=0){
	    			//console.log('queryparams passed: True');
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
			qstr = 'FacilityReportID IN (select FacilityReportID from ' + elmconf.contenttypes[$scope.contenttype] + ' where (';
			switch($scope.contenttype){
				case 'facilitylevel':
					var arrfQue = [];
					var arrmed = [];
					if (queryparams['MediumCode'] ){
						for (var med in queryparams['MediumCode']){
							arrmed.push("(MediumCode = '" + queryparams['MediumCode'][med] + "')");
						}
						arrfQue.push('('+arrmed.join(" OR ")+')');
					}
					var arrwt = [];
					if (queryparams['WasteTypeCode'] ){
						for (var wt in queryparams['WasteTypeCode']){
							arrwt.push("(WasteTypeCode = '" + queryparams['WasteTypeCode'][wt] + "')");
						}
						arrfQue.push('('+arrwt.join(" OR ")+')');
					}
					var arrwtr = [];
					if (queryparams['WasteTreatmentCode'] ){
						for (var wtr in queryparams['WasteTreatmentCode']){
							arrwtr.push("(WasteTreatmentCode = '" + queryparams['WasteTreatmentCode'][wtr] + "')");
						}
						arrfQue.push('('+arrwtr.join(" OR ")+')');
					}
					if (queryparams.Accidental){
						arrfQue.push('(Accidental=1)');
					}
					if (queryparams.WHPCountryID){
						arrfQue.push('(WHPCountryID='+queryparams.WHPCountryID+')');
					}
					if (queryparams.LOV_PollutantGroupID){
						arrfQue.push('(LOV_PollutantGroupID='+queryparams.LOV_PollutantGroupID+')');
					}
					if (queryparams.LOV_PollutantID){
						arrfQue.push('(LOV_PollutantID='+queryparams.LOV_PollutantID+')');
					}
					if (arrfQue.length > 0){
	        			qstr += '('+ arrfQue.join(" AND ")+')))';
		        		arrQue.push(qstr);
	        		}
					else{
						qstr = '';
					}
					break;
			
				case 'pollutantrelease':
		    		if (queryparams['LOV_PollutantID'] && queryparams['LOV_PollutantID'] != '' && $scope.contenttype != undefined){
		    			qstr += 'LOV_PollutantID = '+queryparams['LOV_PollutantID'];
		        		if (queryparams['LOV_PollutantGroupID'] && queryparams['LOV_PollutantGroupID'] != ''){
		        			qstr += ' AND LOV_PollutantGroupID = '+queryparams['LOV_PollutantGroupID'];
		        		}
		        		qstr += $scope.getMediumQP(queryparams);
		    			qstr += '))';
		        		arrQue.push(qstr);
		    		}
		    		else if (queryparams['LOV_PollutantGroupID'] && queryparams['LOV_PollutantGroupID'] != ''){
		    			qstr += 'LOV_PollutantGroupID = '+queryparams['LOV_PollutantGroupID'];
		        		qstr += $scope.getMediumQP(queryparams);
		    			qstr += '))';
		        		arrQue.push(qstr);
		    		}
		    		break;
				case 'pollutanttransfer':
					var arrfQue = [];
					if (queryparams.LOV_PollutantGroupID){
						arrfQue.push('(LOV_PollutantGroupID='+queryparams.LOV_PollutantGroupID+')');
					}
					if (queryparams.LOV_PollutantID){
						arrfQue.push('(LOV_PollutantID='+queryparams.LOV_PollutantID+')');
					}
					if (arrfQue.length > 0){
	        			qstr += '('+ arrfQue.join(" AND ")+')';
	        		}
	    			qstr += '))';
	        		if(arrfQue)arrQue.push(qstr);
					break;
				case 'wastetransfer':
	    			var arrwt = [];
	    			if (queryparams['WasteTypeCode'] ){
		        		arrwt.push($scope.getWasteTypeQP(queryparams));
		        		arrwt.push($scope.getWasteTreatmentQP(queryparams));

		        		if (arrwt.length > 0){
		        			qstr += '('+  arrQue.join(" AND ") +')';
		        		}
		        		qstr += '))';
		        		arrQue.push(qstr);
	    			}
	    			break;
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
        	$scope.where = elmconf.defquery;
        }
    };

	//Sub function building QueryString
    $scope.getMediumQP = function(qp){
		var arrmed = [];
		if (qp['MediumCode'] ){
			$.each(qp['MediumCode'], function(k, v) {
				if (v !== 'WASTEWATER'){
					arrmed.push('(Quantity' + v + ' IS NOT NULL)');
				}
			});
			
		}
		return (arrmed.length > 0)?' AND (' + arrmed.join(" OR ") + ') ':" ";
	};

	//Sub function building QueryString
    $scope.getWasteTypeQP = function(qp){
    	var arrwt = [];
		if (qp['WasteTypeCode'] ){
			$.each(qp['WasteTypeCode'], function(k, v) {
				if (v !== 'HW'){
					arrwt.push('(ConfidentialIndicator' + v.replace('-','') + ' IS NOT NULL)');
				}
			});
		}
		return (arrwt.length > 0)? ' AND (' + arrwt.join(" OR ") + ') ':" ";
	};

	//Sub function building QueryString
    $scope.getWasteTreatmentQP = function(qp){
    	var arrwt = [];
		if (qp['WasteTreatmentCode'] ){
			if(qp['WasteTreatmentCode']['R']){
				arrwt.push('(HasReportedRecovery = 1)');
			}
			else{
				arrwt.push('(HasReportedRecovery = 0)');
			}
			if(qp['WasteTreatmentCode']['D']){
				arrwt.push('(HasReportedDisposal = 1)');
			}
			else{
				arrwt.push('(HasReportedDisposal = 0)');
			}
			if(qp['WasteTreatmentCode']['U']){
				arrwt.push('(HasReportedUnspecified = 1)');
			}
			else{
				arrwt.push('(HasReportedUnspecified = 0)');
			}
		}
		return (arrwt.length > 0)? ' (' +arrwt.join(" AND ") + ') ':" ";
	}
    
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

	$scope.$watch('mapurls', function() {
		if($scope.mapurls){
			//Here we initialize the map
			leafletData.getMap().then(function(map) {
				//Initial extent
				map.invalidateSize();
				map.setView(elmconf.europebounds, elmconf.europezoom);
				map.attributionControl = false;
				
				elm_ctrl.elm_map = map
				
				//We set the baselayer - in version 2 we can add more baselayers and a selector
				L.esri.basemapLayer("Streets").addTo(map);
		
				//Here we define the Clustered Feature Service layer
				elm_ctrl.fdlay = L.esri.clusteredFeatureLayer({
					url: $scope.mapurls.facilitiesUrl, // elmconf.eprtrLayerUrl,
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
				       //Points used by zoomToFeatures
					   //points.push(latlng)
					   var sec = geojson.properties.IASectorCode.toLowerCase();
					   return L.marker(latlng, {
					        icon: L.AwesomeMarkers.icon($scope.eprtricons[(elmconf.sectors.indexOf(sec)>0)?sec:'others'])
					      });
				    },
				}, function(error) {
					console.log('esrileafmap error: '+ error);
			    });
		
				//Here we try to navigate to the extent of the selected features - still not satisfied
		/*		elm_ctrl.fdlay.on('load', function(e){
		//			console.log('pnts: '+ points.length);
					if (points.length > 0){
						var bounds = $scope.updateExtent(points);
			//			console.log('Once: '+ bounds.toBBoxString());
			  		    map.fitBounds(bounds,{maxZoom:3});
			  		    points = [];
					};
				  // do something on load
				});*/
				//Now we add the clusterlayer to the map
				elm_ctrl.fdlay.addTo(map);
		
				//Here we bind a HTML template to the the popup - TODO 
				elm_ctrl.fdlay.bindPopup(function (feature) {
						//console.log('pop: '+ feature.properties.X + ' ' + feature.properties.Y);
		        	    return L.Util.template('<p><em>Facility</em>: {FacilityName }<br><em>Reporting Year</em>: {ReportingYear }<br><em>Country</em>: {CountryCode }<br><a target="_blank" href="#facilitydetails?FacilityID={FacilityID}&ReportingYear={ReportingYear}">details</a></p>', feature.properties);
		        	  });
		
				$scope.toggleLegend = L.easyButton({
					  states: [{
					    stateName: 'show-legend',
					    icon: 'fa-bars',
					    title: 'show legend',
					    onClick: function(control) {
					    	if(elm_ctrl.legend){
					    		elm_ctrl.legend.addTo(elm_ctrl.elm_map);
					    	};
					      control.state('hide-legend');
					    }
					  }, {
					    icon: 'fa-bars',
					    stateName: 'hide-legend',
					    onClick: function(control) {
					      elm_ctrl.elm_map.removeControl(elm_ctrl.legend);
					      control.state('show-legend');
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
	
		    var div = L.DomUtil.create('div', 'leaflet-control-layers legend');
		    var h4 = L.DomUtil.create('h4', '', div);
		    h4.innerHTML += 'Industrial Activity Sectors';
		    var tab = L.DomUtil.create('table', '', div);
		    /*eprtricons: {
				1: {icon: 'home', prefix: 'fa',	markerColor: 'darkgreen'},	*/	
		    angular.forEach($scope.eprtricons, function(value, key) {
	    	  var lab = ($scope.lov.hasOwnProperty(key))?$scope.lov[key]:'Others';
	    	  var clss = value.prefix +" " + value.prefix +"-"+ value.icon;
	    	  tab.innerHTML += '<tr><td><i class="circle ' + clss + 
	    	  '" style="background:' + $scope.eprtriconcolors[value.markerColor] + 
		      '"></i></td><td>' + lab + '</td></tr>';
		    });
		    return div;
		    
		    /*
		    var div = L.DomUtil.create('div', 'leaflet-control-layers legend');
		    var h4 = L.DomUtil.create('h4', '', div);
		    h4.innerHTML += 'Industrial Activity Sectors';
		    var ul = L.DomUtil.create('ul', 'fa-ul', div);
		    angular.forEach($scope.eprtricons, function(value, key) {
	    	  var lab = ($scope.lov.hasOwnProperty(key))?$scope.lov[key]:'Others';
	    	  var clss = value.prefix +" " + value.prefix +"-"+ value.icon;
	    	  ul.innerHTML += '<li><i class="fa-li circle ' + clss + '" style="background:' + $scope.eprtriconcolors[value.markerColor] + 
		      '"></i> ' + lab + '</li>';
		    });
		    return div;
		     * */
		};
	
		//elm_ctrl.legend.addTo(elm_ctrl.elm_map);
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
.directive('esriLeafMap', function() {
	return {
		restrict: 'E',
		controller: 'esriLeafMapController',
        transclude: true,
		scope: {
			frid: '@facilityReportId',
			wherestr: '=',
			queryparams: '=',
			contenttype: '=', 
			control: '='

		},
		templateUrl: 'components/esrileafmap/esrileafmap.html',
		link: function(scope, element, attrs){
			scope.$watch('queryparams', function() {
				if(scope.queryparams !== undefined){
					scope.setwhere(scope.buildWhere(scope.queryparams));
				}
		    },true);
			scope.$watch('wherestr', function() {
				if (scope.wherestr !== undefined){
					scope.setwhere(scope.wherestr);
				}
		    },true);
			scope.$watch('contenttype', function() {
				if(scope.queryparams !== undefined){
					scope.setwhere(scope.buildWhere(scope.queryparams));
				}
				else if (scope.wherestr !== undefined){
					scope.setwhere(scope.wherestr);
				}
		    },true);
			 scope.internalControl = scope.control || {};
			 scope.internalControl.redraw = function() {
				if (scope.queryparams !== undefined){
					scope.redraw();
				}
		    };
		}
	};
});