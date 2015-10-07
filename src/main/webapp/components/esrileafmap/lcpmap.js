'use strict';

angular.module('myApp.lcpmap', ['ngRoute','leaflet-directive'])
/*
 * Find better solution for these constants?
 * */
.constant('lcpconf',{
	//http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer
	//http://sdkcga6350:6080/arcgis/rest/services/EprtrFacilities/FeatureServer/0
	'lcpLayerUrl':'http://test.discomap.eea.europa.eu/arcgis/rest/services/AIR/EPRTR_LCP_demo/MapServer/',
	'europebounds': [53.526, 10.667],
	'europezoom': 3,
	'layerfields':{
		0:{'id': 'ID', 'fk_basicdata_id': 'FK_BasicData_ID', 'plantname': 'PlantName',
			'plantid': 'PlantId', 'facilityname': 'FacilityName', 'eprtrnationalid': 'EPRTRNationalId',
			'address1': 'Address1', 'address2': 'Address2', 'city': 'City', 'region': 'Region',
			'postalcode': 'PostalCode', 'longitude': 'Longitude', 'latitude': 'Latitude'},
		1:{'id':'ID','reportId':'Report_ID', 'most_recent_report': 'most_recent_report',
		    'memberstate':'MemberState', 'referenceyear':  'ReferenceYear', 'numberofplants': 'NumberOfPlants',
		    'organization': 'Organization', 'address1': 'Address1', 'address2': 'Address2',
		    'city': 'City', 'state': 'State', 'postalcode': 'PostalCode', 'nameofcontactperson': 'NameOfContactPerson',
		    'phone': 'Phone', 'email': 'EMail', 'report_submissiondate': 'report_submissiondate',
		    'envelope_url': 'envelope_url', 'filename': 'filename', 'envelope_isreleased': 'envelope_isreleased'},
		2:{'id': 'ID', 'fk_plant_id': 'FK_Plant_ID', 'biomass': 'Biomass', 'othersolidfuels': 'OtherSolidFuels',
			'liquidfuels': 'LiquidFuels', 'naturalgas': 'NaturalGas', 'othergases': 'OtherGases', 'hardcoal': 'HardCoal',
			'lignite': 'Lignite', 'so2': 'SO2', 'nox': 'NOx', 'dust': 'Dust'},
		3:{'id': 'ID', 'fk_plant_id': 'FK_Plant_ID', 'art5_1': 'Art5_1', 'operatinghours': 'OperatingHours',
			'elvso2': 'ElvSO2', 'notabeneannexIII': 'NotaBeneAnnexIII', 'notabeneelvso2': 'NotaBeneElvSO2',
			'desulphurisationrate': 'DesulphurisationRate', 'sinput': 'SInput', 'annexVI_a_footnote2': 'AnnexVI_A_Footnote2',
			'annexVI_a_footnote2_operatingho': 'AnnexVI_A_Footnote2_OperatingHo', 'elvnox': 'ElvNOx', 'annexVI_a_footnote3': 'AnnexVI_A_Footnote3',
			'volatilecontents': 'VolatileContents', 'annexVI_a_footnote3_elvnox': 'AnnexVI_A_Footnote3_ElvNOx', 'comments': 'Comments'},
		4:{'id': 'ID', 'fk_plant_id': 'FK_Plant_ID', 'optoutplant': 'OptOutPlant', 'capacityoptedoutmw': 'CapacityOptedOutMW',
			'hoursoperated': 'HoursOperated', 'plantincludedinnerp': 'PlantIncludedInNERP'},
		5:{'id': 'ID', 'fk_plant_id': 'FK_Plant_ID', 'statusotheplant': 'StatusOfThePlant', 'mwth': 'MWth',
			'extensionby50mwormore': 'ExtensionBy50MWOrMore', 'capacityaddedmw': 'CapacityAddedMW', 'substantialchange': 'SubstantialChange',
			'capacityaffectedmw': 'CapacityAffectedMW', 'dateofstartofoperation': 'DateOfStartOfOperation', 'refineries': 'Refineries',
			'othersector': 'OtherSector', 'gasturbine': 'GasTurbine', 'gasturbinethermalinput': 'GasTurbineThermalInput', 'boiler': 'Boiler',
			'boilerthermalinput': 'BoilerThermalInput', 'gasengine': 'GasEngine', 'gasenginethermalinput': 'GasEngineThermalInput',
			'dieselengine': 'DieselEngine', 'dieselengineturbinethermalinput': 'DieselEngineTurbineThermalInput', 'other': 'Other',
			'othertypeofcombustion': 'OtherTypeOfCombustion', 'otherthermalinput': 'OtherThermalInput', 'operatinghours': 'OperatingHours',
			'comments': 'Comments'}},
	'displayfields':{
		0:['PlantName','PlantId', 'FacilityName', 'EPRTRNationalId', 'Address1', 'Address2', 'City', 'Region',
			'PostalCode', 'Longitude', 'Latitude'],
		1:['Report_ID', 'MemberState', 'ReferenceYear', 'NumberOfPlants', 'Organization', 'Address1', 'Address2',
		    'City', 'State', 'PostalCode', 'NameOfContactPerson', 'Phone', 'EMail', 'report_submissiondate'],
		2:['Biomass', 'OtherSolidFuels','LiquidFuels', 'NaturalGas', 'OtherGases', 'HardCoal',
			'Lignite','SO2', 'NOx', 'Dust'],
		3:['Art5_1', 'OperatingHours', 'ElvSO2', 'NotaBeneAnnexIII', 'NotaBeneElvSO2', 'DesulphurisationRate', 'SInput',  'AnnexVI_A_Footnote2',
			'AnnexVI_A_Footnote2_OperatingHo','ElvNOx', 'AnnexVI_A_Footnote3',
			'VolatileContents',  'AnnexVI_A_Footnote3_ElvNOx',  'Comments'],
		4:['OptOutPlant',  'CapacityOptedOutMW', 'HoursOperated',  'PlantIncludedInNERP'],
		5:['StatusOfThePlant', 'MWth', 'ExtensionBy50MWOrMore', 'CapacityAddedMW', 'SubstantialChange',
			'CapacityAffectedMW', 'DateOfStartOfOperation',  'Refineries',  'OtherSector',  'GasTurbine', 'GasTurbineThermalInput',  'Boiler',
			'BoilerThermalInput',  'GasEngine',  'GasEngineThermalInput', 'DieselEngine', 'DieselEngineTurbineThermalInput',  'Other',
			'OtherTypeOfCombustion', 'OtherThermalInput',  'OperatingHours','Comments']			
	},
	'passInFilter': ['ID', 'FK_BasicData_ID', 'PlantName', 'PlantId', 'FacilityName', 'EPRTRNationalId',
	    			'Address1', 'Address2', 'City', 'Region', 'PostalCode']

})

.controller('lcpMapController', ['$scope',  'leafletData', 'lcpconf', 'translationService', function($scope,  leafletData, lcpconf, translationService) {
	var elm_ctrl = this;
	$scope.legenddef = {};

	var where = '';
	translationService.get('LCP').then(function (data) {
		$scope.lov = data;
    });
	
	/*$scope.$watchCollection('[lov,elm_ctrl]', function(value){
    	if($scope.lov && elm_ctrl.elm_map){
    		$scope.createLegend();
    	}
    });*/
	/*
	 * We extend scope with a collection of icons and two functions
	 * Icons uses the Leaflet.awsome-markers plugin
	 * SetWhere function is called when the query parameters are changed after load
	 * buildWhere function is called when we want to parse the query parameters into a where string
	 * */
	angular.extend($scope, {
		//icon: L.AwesomeMarkers.icon({icon: 'spinner', prefix: 'fa', markerColor: 'red', spin:true}) }).addTo(map);
		setwhere: function(where_str){
			//console.log('setWhere: ' + where_str);
			if ($scope.where != where_str){
				$scope.where = where_str;
			}
			//{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}
			if(elm_ctrl.dmlay){
				elm_ctrl.dmlay.setLayerDefs({0:where_str});
				//console.log('elm_ctrl.dmlay: True');
			}
			else if(elm_ctrl.elm_map){
				var dmlay = elm_ctrl.elm_map.getLayer(1); 
				dmlay.setLayerDefs({0:where_str});
			}
			else {
				$scope.where = where_str;
			}			
		},
	    buildWhere: function(queryparams) {
	    	//
	    	var arrQue = []
	    	for (var key in queryparams){
	    		if (lcpconf.passInFilter.indexOf(key)>=0){
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
	    		else{
      			  switch(key) {
    			  case 'countryCode':
   // 				  arrQue.push(lcpconf.layerfields[0].memberstate + "='"+queryparams[key]+"'");
			          break;
			      case 'ReportingYear':
			    	  //arrQue.push(lcpconf.layerfields[0].referenceyear + "=2013");
    				  //qs.push(lcpconf.layerfields[0].referenceyear + "="+query[key]);
			          break;
    			  case 'regionCodes':
    				  //http://localhost:8080/nutsRegionChilds/235
    				  arrQue.push(lcpconf.layerfields[0].region + " in ('" + queryparams[key].join("','") + "')");
			          break;
    			  case 'regionCode':
    				  //http://localhost:8080/nutsRegionChilds/235
    				  arrQue.push(lcpconf.layerfields[0].region + "='"+queryparams[key]+"'");
			          break;
			      case 'BasicID':
			    	  arrQue.push(lcpconf.layerfields[0].fk_basicdata_id + "="+queryparams[key]);
			          break;
			      case 'BasicGroup':
		    		  arrQue.push(lcpconf.layerfields[0].fk_basicdata_id + " in ('" + queryparams[key].join("','") + "')");
			          break;
			      case 'PlantID':
		    		  arrQue.push(lcpconf.layerfields[0].plantid + "=" + queryparams[key]);
			          break;
			      case 'PlantGroup':
		    		  arrQue.push(lcpconf.layerfields[0].plantid + " in ('" + queryparams[key].join("','") + "')");
			          break;
			          
			   /*   default:
			          default code block*/
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
        /*else if ($scope.frid){
        	$scope.where = "FacilityReportID=" + $scope.frid;
        }*/
        else {
        	$scope.where = lcpconf.defquery;
        }
    };

	//Here we initialize the map
	leafletData.getMap().then(function(map) {
		//Initial extent
		map.invalidateSize();
		map.setView(lcpconf.europebounds, lcpconf.europezoom);
		map.attributionControl = false;
		
		elm_ctrl.elm_map = map
		
		L.esri.get = L.esri.Request.get.JSONP;
		//We set the baselayer - in version 2 we can add more baselayers and a selector
		L.esri.basemapLayer("Streets").addTo(map);

		elm_ctrl.dmlay = L.esri.dynamicMapLayer(lcpconf.lcpLayerUrl, {
		    opacity: 0.5,
		    useCors: false,
		    layers:[0],
			f: 'image',
			proxy:''
		  });//.addTo(map);
		
		elm_ctrl.dmlay.addTo(map);
		
		elm_ctrl.dmlay.bindPopup(function (error, featureCollection) {
		    if(error || featureCollection.features.length === 0) {
		      return false;
		    } else {
		    	var keys = Object.keys(featureCollection.features[0].properties);
		    	var _str = '<p><em>Plant</em>: '+featureCollection.features[0].properties[keys[3]]+'<br>';
		    	_str += '<em>Facility</em>: '+featureCollection.features[0].properties[keys[5]]+'<br>';
			    _str += '<a href="#lcpdetailsview?PlantID='+featureCollection.features[0].properties[keys[4]]+'">details</a></p>';
		    	//, feature.properties
        	    return _str;//L.Util.template(_str, featureCollection.features[0].properties);

		    }
		  });

		//$scope.createLegend();

		/*$scope.toggleLegend = L.easyButton({
			  states: [{
			    stateName: 'show-legend',
			    icon: 'fa-bars',
			    title: 'show legend',
			    onClick: function(control) {
			    	elm_ctrl.legend.addTo(elm_ctrl.elm_map);
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
		$scope.toggleLegend.addTo(elm_ctrl.elm_map);*/
		
	});
	
	$scope.redraw = function(){
		if(elm_ctrl.elm_map){
			window.setTimeout(function(){elm_ctrl.elm_map.invalidateSize();}, 600)
		}
	};
	
	/*$scope.createLegend = function(){

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
				    	var _url = lcpconf.lcpLayerUrl + '/0/images/' + leg.url;
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

	}*/
	
	
}])

/*
 * This directive enables us to define this module as a custom HTML element
 * <esri-leaf-map queryparams="" /> 
 * You can use only one of these parameters: 
 *    facility-report-id: Interesting in the facilitydetails view where we only focus on one facility
 *    wherestr: This has given me some problems because Angular wants to pass the string as an expression
 *    queryparams: a JSON oject with key, value pairs eg. {"ReportingYear":2008, "CountryCode":"NL"}    
 * */
.directive('lcpMap', function() {
	return {
		restrict: 'E',
		controller: 'lcpMapController',
        transclude: true,
		scope: {
			wherestr: '=',
			queryparams: '=',
			contenttype: '=', 
			control: '='
		},
		templateUrl: 'components/esrileafmap/lcpmap.html',
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