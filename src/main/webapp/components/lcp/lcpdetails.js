'use strict';

angular.module('myApp.lcpdetails', ['ngRoute','restangular','ngSanitize', 'myApp.lcpmap','leaflet-directive'])

.controller('lcpDetailsController', 
		['$scope', '$http', '$filter', '$sce', '$modal', 'leafletData','eprtrcms', 'eprtrmaps', 'formatStrFactory', 'lcpDataService', 'lcpconf',
		 function($scope, $http, $filter, $sce, $modal, leafletData,eprtrcms, eprtrmaps,formatStrFactory,  lcpDataService,lcpconf) {

/*
 * Basic parameters
 * */
	$scope.ff = formatStrFactory;
	$scope.alldata = [];
	
	var degrees = "°";

/*
 * Load translation resources 
 * */        
//	Requesting text and title resources 
	eprtrcms.get('Facility',null).then(function (data) {
		$scope.tr_f = data;
	});
	eprtrcms.get('Common',null).then(function (data) {
		$scope.tr_c = data;
	});
	eprtrcms.get('LCP',null).then(function (data) {
		$scope.tr_lcp = data;
	});
	eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
		$scope.tr_lco = data;
	});
	eprtrcms.get('LOV_NUTSREGION',null).then(function (data) {
		$scope.tr_lnr = data;
	});
	eprtrcms.get('LOV_METHODBASIS',null).then(function (data) {
		$scope.tr_lmbn = data;
	});
	eprtrcms.get('LOV_METHODTYPE',null).then(function (data) {
		$scope.tr_lmtn = data;
	});
	eprtrcms.get('Library',null).then(function (data) {
		$scope.tr_lib = data;
	});
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});

	/*
	 * Request data by FacilityReportID
	 * */
	$scope.updateByPlantid = function(){
		var qp = {'PlantID':$scope.plantid};
		//$scope.map = {wh : {'FacilityReportID': $scope.frid}};
        lcpDataService.get($scope.mapurls.lcpUrl,0, qp).then(function (data) {
        	//$scope.initBasicData(data);
        	//$scope.ajustplantdata(data);
        	$scope.callAllPlants(data.features[0].attributes[lcpconf.layerfields[0].uniqueplantid]);
        });        	
        /*lcpDataService.get(3, qp).then(function (data) {
			$scope.ajustart15data(data);
	    });*/        	
	    lcpDataService.get($scope.mapurls.lcpUrl,4, qp).then(function (data) {
			$scope.ajustnerpdata(data);
	    });        	
	    lcpDataService.get($scope.mapurls.lcpUrl,5, qp).then(function (data) {
			$scope.ajustdetailsdata(data);
	    });        	
	};
	$scope.$watchCollection('[plantid,mapurls]', function() {
		if($scope.plantid && $scope.mapurls){
			$scope.updateByPlantid();
		}
	});
	//Watch results for FacilitydetailsDetail request and common resources
	$scope.initBasicData = function(item) {
		if(item){
			//var item = plantdata.features[0].attributes;
			var qp = {'BasicID':item[lcpconf.layerfields[0].fk_basicdata_id]};
	        lcpDataService.get($scope.mapurls.lcpUrl,1, qp).then(function (data) {
				$scope.ajustbasicdata(data);// = (data.features)?data.features[0].attributes:{};
		        /*cpDataService.get(2, {'PlantID':$scope.plantid}).then(function (data) {
					$scope.ajustenergydata(data);
		        });*/        	
	        });        	
			var coord = [item[lcpconf.layerfields[0].latitude],item[lcpconf.layerfields[0].longitude]];
	      //Here we initialize the map
	    	leafletData.getMap().then(function(map) {
	    		//Initial extent
	    		map.invalidateSize();
	    		map.setView(coord, 7);
	    		map.attributionControl = false;
	    		
	    		//We set the baselayer - in version 2 we can add more baselayers and a selector
	    		L.esri.basemapLayer("Streets").addTo(map);
	    		
	    		L.marker(coord, {icon: L.AwesomeMarkers.icon({icon: 'home', prefix: 'fa', markerColor: 'darkgreen'})}).addTo(map);
	    	});
	    	
		}
	};
	
	/*$scope.ajustplantdata = function(data){
		$scope.plantdata = {};
		if (data.features){
			var item = data.features[0].attributes;
			var _pl = {'plantid':item[lcpconf.layerfields[0].plantid]};
			_pl['id'] = item[lcpconf.layerfields[0].id];
			_pl['facility'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].facilityname], null);
			_pl['plant'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].plantname], null);
			_pl['address'] = (item[lcpconf.layerfields[0].address2])?
					$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null) + ', ' + $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address2], null):
						$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null);
			_pl['city'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].city], null);
			_pl['region'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].region], null);
			_pl['postalcode'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].postalcode], null);
			_pl['coords'] = "("+item[lcpconf.layerfields[0].latitude]+degrees+", "+item[lcpconf.layerfields[0].longitude]+degrees+")";
			_pl['address'] += ', '+ _pl['postalcode'] +', '+ _pl['city'];
			_pl['eprtrnationalid'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].eprtrnationalid], null);
			
			$scope.plantdata = _pl;
		}
	} */

	$scope.ajustdetailsdata = function(data){
		$scope.detailsdata = {};
		if (data.features){
			var item = data.features[0].attributes;
			var _dd = {'Statusotheplant':$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].statusotheplant], null)};
			_dd['Mwth'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].mwth], null);
			_dd['Extensionby50mwormore'] = item[lcpconf.layerfields[5].extensionby50mwormore];
			_dd['Capacityaddedmw'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].capacityaddedmw], null);
			_dd['Substantialchange'] = item[lcpconf.layerfields[5].substantialchange];
			_dd['Capacityaffectedmw'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].capacityaffectedmw], null);
			_dd['Dateofstartofoperation'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].dateofstartofoperation], null);
			_dd['Refineries'] = item[lcpconf.layerfields[5].Refineries];
			_dd['Othersector'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].othersector], null);
			_dd['Gasturbine'] = item[lcpconf.layerfields[5].gasturbine];
			_dd['Gasturbinethermalinput'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].gasturbinethermalinput], null);
			_dd['Boiler'] = item[lcpconf.layerfields[5].boiler];
			_dd['Boilerthermalinput'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].boilerthermalinput], null);
			_dd['Gasengine'] = item[lcpconf.layerfields[5].gasengine];
			_dd['Gasenginethermalinput'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].gasenginethermalinput], null);
			_dd['Dieselengine'] = item[lcpconf.layerfields[5].dieselengine];
			_dd['Dieselengineturbinethermalinput'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[5].dieselengineturbinethermalinput], null);
			$scope.detailsdata = _dd;
		}
	} 

	$scope.ajustbasicdata = function(data){
		$scope.basicdata = {};
		if (data.features){
			var item = data.features[0].attributes;
			
			var _bd = {'id':item[lcpconf.layerfields[1].id]};
			_bd['reportId'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].reportid], null);
			_bd['most_recent_report'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].most_recent_report], null);
			_bd['memberstate'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].memberstate], null);
			_bd['referenceyear'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].referenceyear], null);
			_bd['numberofplants'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].numberofplants], null);
			_bd['organization'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].organization], null);
			_bd['city'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].city], null);
			_bd['state'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].state], null);
			_bd['postalcode'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].postalcode], null);
			_bd['nameofcontactperson'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].nameofcontactperson], null);
			_bd['phone'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].phone], null);
			_bd['email'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].email], null);
			_bd['report_submissiondate'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].report_submissiondate], null);
			_bd['envelope_url'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].envelope_url], null);
			_bd['filename'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].filename], null);
			_bd['envelope_isreleased'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[1].envelope_isreleased], null);
			_bd['address'] = (item[lcpconf.layerfields[0].address2])?
					$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null) + ', ' + $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address2], null):
						$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null);
			_bd['address'] += ', '+ _bd['postalcode'] +', '+ _bd['city'];
			_bd['reporteddate'] = '(Last updated: ';
			_bd['reporteddate'] += (_bd['report_submissiondate'])? $filter('date')(_bd['report_submissiondate'], "dd MMM yyyy")+')' : 'Unknown)';
			_bd['country'] = ($scope.tr_lco)?$scope.tr_lco[_bd['memberstate']]:_bd['memberstate'];
			$scope.basicdata = _bd;
		}
	} 

	/*$scope.ajustart15data = function(data){
		$scope.lcpart15data = {};
		if (data.features){

			var item = data.features[0].attributes;
			var _ad = {'id':item[lcpconf.layerfields[3].id]};
			_ad['art5_1'] = item[lcpconf.layerfields[3].art5_1];
			_ad['operatinghours'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].operatinghours], null);
			_ad['elvso2'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].elvso2], null);
			_ad['elvnox'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].elvnox], null);
			_ad['notabeneannexIII'] = item[lcpconf.layerfields[3].notabeneannexIII];
			_ad['notabeneelvso2'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].notabeneelvso2], null);
			_ad['desulphurisationrate'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].desulphurisationrate], null);
			_ad['sinput'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].sinput], null);
			_ad['annexVI_a_footnote2'] = item[lcpconf.layerfields[3].annexVI_a_footnote2];
			_ad['annexVI_a_footnote2_operatingho'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].annexVI_a_footnote2_operatingho], null);
			_ad['annexVI_a_footnote3'] = item[lcpconf.layerfields[3].annexVI_a_footnote3];
			_ad['annexVI_a_footnote3_elvnox'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].annexVI_a_footnote3_elvnox], null);
			_ad['volatilecontents'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].volatilecontents], null);
			_ad['comments'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[3].comments], null);

			$scope.lcpart15data = _ad;
		}
	} */

	$scope.callAllPlants = function(uniqueID){
		var _qstring = $scope.mapurls.lcpUrl + "/0/query?where="+ lcpconf.layerfields[0].uniqueplantid
			+"='"+uniqueID+"'&outFields=*&orderByFields=" 
			+ lcpconf.layerfields[0].id + '&f=pjson';
		$http.get(_qstring).success(function(data, status, headers, config) {
			var _plants = [];
			angular.forEach(data.features, function(plant) {
				var item = plant.attributes;
				if (item[lcpconf.layerfields[0].latitude]!=0 && item[lcpconf.layerfields[0].longitude]!=0){
					//This is the one we display
					$scope.setPlantData(item); 
				}
				$scope.alldata.push({'plantid':item[lcpconf.layerfields[0].plantid],
					'basicid':item[lcpconf.layerfields[0].fk_basicdata_id],
					'oid':item[lcpconf.layerfields[0].id]});
				//_years.push({"year":item.attributes[lcpconf.layerfields[1].referenceyear]});
				
			});
			if(!$scope.plantdata){
				//default
				$scope.setPlantData(data.features[0].attributes); 
			}
			$scope.callAllBasic();
		});
	}
	
	$scope.setPlantData = function(item){
		var _pl = {'plantid':item[lcpconf.layerfields[0].plantid]};
		_pl['id'] = item[lcpconf.layerfields[0].id];
		_pl['facility'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].facilityname], null);
		_pl['plant'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].plantname], null);
		_pl['address'] = (item[lcpconf.layerfields[0].address2])?
				$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null) + ', ' + $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address2], null):
					$scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].address1], null);
		_pl['city'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].city], null);
		_pl['region'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].region], null);
		_pl['postalcode'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].postalcode], null);
		_pl['coords'] = "("+item[lcpconf.layerfields[0].latitude]+degrees+", "+item[lcpconf.layerfields[0].longitude]+degrees+")";
		_pl['address'] += ', '+ _pl['postalcode'] +', '+ _pl['city'];
		_pl['eprtrnationalid'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[0].eprtrnationalid], null);
		$scope.plantdata = _pl;
		$scope.initBasicData(item);
	}
	
	$scope.callAllBasic = function(){
		if($scope.alldata.length > 0){
			var _oids = [];
			angular.forEach($scope.alldata, function(item) {
				_oids.push(item.oid);
			});
			var _qstring = $scope.mapurls.lcpUrl + "/0/queryRelatedRecords?objectIds="+ _oids.join(",") 
			+"&relationshipId=4&outFields=*&f=pjson";
			//Request years
			$http.get(_qstring).success(function(data, status, headers, config) {
				angular.forEach(data.relatedRecordGroups, function(basic) {
					var itemb = basic.relatedRecords[0].attributes;
					angular.forEach($scope.alldata, function(itema) {
						if(itemb[lcpconf.layerfields[1].id] == itema.basicid){
							itema['year'] = itemb[lcpconf.layerfields[1].referenceyear];
						}
					});
				});
				
				//Energy data
				_qstring = $scope.mapurls.lcpUrl + "/0/queryRelatedRecords?objectIds="+ _oids.join(",") 
				+"&relationshipId=0&outFields=*&f=pjson";
				$scope.emissioninput = [];
				$scope.energyinput = [];

				$http.get(_qstring).success(function(data, status, headers, config) {
					angular.forEach(data.relatedRecordGroups, function(energy) {
						var iteme = energy.relatedRecords[0].attributes;
						angular.forEach($scope.alldata, function(itema) {
							if(iteme[lcpconf.layerfields[2].fk_plant_id] == itema.plantid){
								var _em = {}, _en = {};
								//var _ed = {'id':item[lcpconf.layerfields[2].id]};
								if($scope.basicdata && $scope.basicdata.referenceyear){
									_en.year = itema.year;
									_em.year = itema.year;
								}
								_en['biomass'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].biomass], null);
								_en['othersolidfuels'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].othersolidfuels], null);
								_en['liquidfuels'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].liquidfuels], null);
								_en['naturalgas'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].naturalgas], null);
								_en['othergases'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].othergases], null);
								_en['hardcoal'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].hardcoal], null);
								_en['lignite'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].lignite], null);
								_em['so2'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].so2], null);
								_em['nox'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].nox], null);
								_em['dust'] = $scope.ff.ConfidentialFormat(iteme[lcpconf.layerfields[2].dust], null);
								//$scope.energydata = _ed;
								
								$scope.emissioninput.push(_em);
								$scope.energyinput.push(_en);
							}
						});
					});
				});
			});
		}
	}
			
	/*
	 * 
	 * http://air.discomap.eea.europa.eu/arcgis/rest/services/EPRTR/EPRTR_LCP/MapServer/0/query?
	 * where=
	 * 	Unique_Plant_ID+%3D+%27AT0001%27
	 *  &outFields=*&orderByFields=&f=pjson
	 * 
	 * http://air.discomap.eea.europa.eu/arcgis/rest/services/EPRTR/EPRTR_LCP/MapServer/0/queryRelatedRecords?
	 * objectIds=%5B427%2C528%2C628%2C725%2C820&relationshipId=4&outFields=*&definitionExpression=&returnGeometry=true&maxAllowableOffset=
	 * &geometryPrecision=&outSR=&returnZ=false&returnM=false&gdbVersion=&f=html
	 * 
	 * */
	
	
	$scope.ajustnerpdata = function(data){
		$scope.nerpdata = {};
		if (data.features){
			var item = data.features[0].attributes;
			var _nd = {'id':item[lcpconf.layerfields[4].id]};
			_nd['optoutplant'] =item[lcpconf.layerfields[4].optoutplant];
			_nd['capacityoptedoutmw'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[4].capacityoptedoutmw], null);
			_nd['hoursoperated'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[4].hoursoperated], null);
			_nd['plantincludedinnerp'] = item[lcpconf.layerfields[4].plantincludedinnerp];
			$scope.nerpdata = _nd;
		}
	} 

/*	$scope.ajustenergydata = function(data){
		$scope.energydata = {};
		$scope.emissioninput = [];
		$scope.energyinput = [];
		if (data.features){
			var item = data.features[0].attributes;
//TODO: fix years
			var _em = {}, _en = {};
			//var _ed = {'id':item[lcpconf.layerfields[2].id]};
			if($scope.basicdata && $scope.basicdata.referenceyear){
				_en.year= $scope.basicdata.referenceyear;
				_em.year= $scope.basicdata.referenceyear;
			}
			_en['biomass'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].biomass], null);
			_en['othersolidfuels'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].othersolidfuels], null);
			_en['liquidfuels'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].liquidfuels], null);
			_en['naturalgas'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].naturalgas], null);
			_en['othergases'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].othergases], null);
			_en['hardcoal'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].hardcoal], null);
			_en['lignite'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].lignite], null);
			_em['so2'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].so2], null);
			_em['nox'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].nox], null);
			_em['dust'] = $scope.ff.ConfidentialFormat(item[lcpconf.layerfields[2].dust], null);
			//$scope.energydata = _ed;
			
			$scope.emissioninput.push(_em)
			$scope.energyinput.push(_en)
			
		}
	} */
	

}])

/*
 * Factories
 * */
    .service('lcpDataService', function($http, $q, lcpconf) {
      return {
    	  get: function(url, id, query) {

        	var deferred = $q.defer();
            //http://test.discomap.eea.europa.eu/arcgis/rest/services/AIR/EPRTR_LCP_demo/MapServer
            //1/query?wher}e=MemberState+%3D+%27DE%27&outFields=*&f=pjson
              var url = url +'/'+ id+'/query?';
              if(query){
            	  url += "where="
            	  var qs = [];
            	 /* if (id==1){
            		  qs.push(lcpconf.layerfields[id].most_recent_report + "=0");
            	  }*/
        		  for(var key in query) {
        			  switch(key) {
        			  case 'countryCode':
        				  qs.push(lcpconf.layerfields[1].memberstate + "='"+query[key]+"'");
				          break;
        			  case 'regionCodes':
        				  //http://localhost:8080/nutsRegionChilds/235
        				  qs.push(lcpconf.layerfields[0].region + " in (" + query[key].join(",") + ")");
				          break;
        			  case 'regionCode':
        				  //http://localhost:8080/nutsRegionChilds/235
        				  qs.push(lcpconf.layerfields[0].region + "='"+query[key]+"'");
				          break;
				      case 'ReportingYear':
        				  //qs.push(lcpconf.layerfields[id].referenceyear + "=2013");
				    	  //Need all years
        				  qs.push(lcpconf.layerfields[id].referenceyear + "="+query[key]);
				          break;
				      case 'BasicID':
				    	  if(id==1){
				    		  qs.push(lcpconf.layerfields[id].id + "="+query[key]);
				    	  }
				    	  else{
				    		  qs.push(lcpconf.layerfields[id].fk_basicdata_id + "="+query[key]);
				    	  }
				          break;
				      case 'BasicGroup':
				    	  if(id==1){
	        				  qs.push(lcpconf.layerfields[id].id + " in (" + query[key].join(",") + ")");
				    	  }
				    	  else{
	        				  qs.push(lcpconf.layerfields[id].fk_basicdata_id + " in (" + query[key].join(",") + ")");
				    	  }
				          break;
				      case 'PlantID':
				    	  if(id==0){
	        				  qs.push(lcpconf.layerfields[id].id + "=" + query[key]);
				    	  }
				    	  else{
	        				  qs.push(lcpconf.layerfields[id].fk_plant_id + "=" + query[key]);
				    	  }
				          break;
				      case 'PlantGroup':
				    	  if(id==0){
	        				  qs.push(lcpconf.layerfields[id].plantid + " in (" + query[key].join(",") + ")");
				    	  }
				    	  else{
	        				  qs.push(lcpconf.layerfields[id].fk_plant_id + " in (" + query[key].join(",") + ")");
				    	  }
				          break;
				          
				   /*   default:
				          default code block*/
        			  }
        		  }
            	  url += qs.join(" AND ");
              }
              url += '&outFields=*&f=pjson';
          $http.get(url).success(function(results) {
            deferred.resolve(results) 
          },
          function(errors) {
            deferred.reject(errors);
          },
          function(updates) {
            deferred.update(updates);
          });
          return deferred.promise;

    	  }
      };
    })
  .controller('ModalLcpCtrl', function ($scope, $modalInstance, eprtrcms, plantid) {
		eprtrcms.get('LCP',null).then(function (data) {
			$scope.title = data.Plant;
		});
  $scope.plantid = plantid;
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
/*
 * This directive enables us to define this module as a custom HTML element
 * <esri-leaf-map queryparams="" /> 
 * You can use only one of these parameters: 
 *    facility-report-id: Interesting in the facilitydetails view where we only focus on one facility
 *    wherestr: This has given me some problems because Angular wants to pass the string as an expression
 *    queryparams: a JSON oject with key, value pairs eg. {"ReportingYear":2008, "CountryCode":"NL"}    
 * */
.directive('lcpdetails', function() {
	return {
		restrict: 'E',
		controller: 'lcpDetailsController',
        transclude: true,
		scope: {
			plantid: '@plantid'
		},
		templateUrl: 'components/lcp/lcpdetails.html',
		link: function(scope, element, attrs){
			scope.$watch('plantid', function() {
				console.log('PlantID changed:' + scope.plantid);
	        	//scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);
		}
	};
});