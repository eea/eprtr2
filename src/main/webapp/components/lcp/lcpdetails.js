'use strict';

angular.module('myApp.lcpdetails', ['ngRoute','restangular','ngSanitize','myApp.lcpmap','leaflet-directive'])

.controller('lcpDetailsController', 
		['$scope', '$http', '$filter', '$sce', '$modal', 'leafletData','translationService', 'formatStrFactory', 'lcpDataService', 'lcpconf',
		 function($scope, $http, $filter, $sce, $modal, leafletData,translationService,formatStrFactory, lcpDataService,lcpconf) {

/*
 * Basic parameters
 * */
	$scope.fFactory = formatStrFactory;
	$scope.headitms = [];
	$scope.infoitms = [{'order':0,	'clss':'fdTitles', 	'title':'Facility Details',	'val': ' '}];
	$scope.infoitms2 = [];
	$scope.showalert = false;
	var degrees = "°";


/*
 * Load translation resources 
 * */        
//	Requesting text and title resources 
	translationService.get().then(function (data) {
		$scope.tr_f = data.Facility;
		$scope.tr_c = data.Common;
		$scope.tr_lcp = data.LCP;
		$scope.tr_lco = data.LOV_COUNTRY;
		$scope.tr_lmbn = data.LOV_METHODBASIS;
		$scope.tr_lmtn = data.LOV_METHODTYPE;
		$scope.tr_lib = data.Library;
    });
/*	translationService.get('Facility').then(function (data) {
		$scope.tr_f = data;
    });*/
	
/*
 * Reset collection when Reporting year changed  
 * */
	$scope.resetcollections = function(){
		$scope.headitms = [];
		$scope.infoitms = [{'order':0,	'clss':'fdTitles', 	'title':'Facility Details',	'val': ' '}];
		$scope.infoitms2 = [];
	}
        
/*
 * Tab handling
 * */
        
    $scope.active = {
		plant: true
	};
    $scope.activateTab = function(tab) {
    	  $scope.active = {}; //reset
    	  $scope.active[tab] = true;
    	}

	/*
	 * Request data by FacilityReportID
	 * */
	$scope.updateByPlantid = function(){
		var qp = {'PlantID':$scope.plantid};
		//$scope.map = {wh : {'FacilityReportID': $scope.frid}};
        lcpDataService.get(0, qp).then(function (data) {
			$scope.plantdata = (data.features)?data.features[0].attributes:{};
        });        	
        lcpDataService.get(2, qp).then(function (data) {
			$scope.energydata = (data.features)?data.features[0].attributes:{};
        });        	
        lcpDataService.get(3, qp).then(function (data) {
			$scope.lcpart15data = (data.features)?data.features[0].attributes:{};
        });        	
        lcpDataService.get(4, qp).then(function (data) {
			$scope.nerpdata = (data.features)?data.features[0].attributes:{};
        });        	
        lcpDataService.get(5, qp).then(function (data) {
			$scope.detailsdata = (data.features)?data.features[0].attributes:{};
        });        	

	};
	$scope.updateByPlantid();
	//Watch results for FacilitydetailsDetail request and common resources
	$scope.$watch('plantdata', function(value) {
		if($scope.plantdata){
			var qp = {'BasicID':value[lcpconf.layerfields[0].fk_basicdata_id]};
	        lcpDataService.get(1, qp).then(function (data) {
				$scope.basicdata = (data.features)?data.features[0].attributes:{};
	        });        	
			
	      //Here we initialize the map
	    	leafletData.getMap().then(function(map) {
	    		//Initial extent
	    		map.invalidateSize();
	    		map.setView([value[lcpconf.layerfields[0].latitude],value[lcpconf.layerfields[0].longitude]], 13);
	    		map.attributionControl = false;
	    		
	    		//We set the baselayer - in version 2 we can add more baselayers and a selector
	    		L.esri.basemapLayer("Streets").addTo(map);
	    	});
		}
	});
	/**
	 * Filters
	 */
	$scope.plantfilter = function(key, value){
		return key in lcpconf.displayfields[0] ? true : false;
	};
	$scope.basicfilter = function(key, value){
		return key in lcpconf.displayfields[1] ? true : false;
	};
	$scope.energyfilter = function(key, value){
		return key in lcpconf.displayfields[2] ? true : false;
	};
	$scope.lcpart15filter = function(key, value){
		return key in lcpconf.displayfields[3] ? true : false;
	};
	$scope.nerpfilter = function(key, value){
		return key in lcpconf.displayfields[4] ? true : false;
	};
	$scope.detailsfilter = function(key, value){
		return key in lcpconf.displayfields[5] ? true : false;
	};

}])

/*
 * Factories
 * */
    .service('lcpDataService', function($http, $q, lcpconf) {
      return {
    	  get: function(id, query) {
        	var deferred = $q.defer();
            //http://test.discomap.eea.europa.eu/arcgis/rest/services/AIR/EPRTR_LCP_demo/MapServer
            //1/query?wher}e=MemberState+%3D+%27DE%27&outFields=*&f=pjson
              var url = lcpconf.lcpLayerUrl + id+'/query?';
              if(query){
            	  url += "where="
            	  var qs = [];
            	 /* if (id==1){
            		  qs.push(lcpconf.layerfields[id].most_recent_report + "=0");
            	  }*/
        		  for(var key in query) {
        			  switch(key) {
        			  case 'countryCode':
        				  qs.push(lcpconf.layerfields[id].memberstate + "='"+query[key]+"'");
				          break;
				      case 'ReportingYear':
        				  qs.push(lcpconf.layerfields[id].referenceyear + "=2013");
        				  //qs.push(lcpconf.layerfields[id].referenceyear + "="+query[key]);
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
	        				  qs.push(lcpconf.layerfields[id].id + " in ('" + query[key].join("','") + "')");
				    	  }
				    	  else{
	        				  qs.push(lcpconf.layerfields[id].fk_basicdata_id + " in ('" + query[key].join("','") + "')");
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
	        				  qs.push(lcpconf.layerfields[id].plantid + " in ('" + query[key].join("','") + "')");
				    	  }
				    	  else{
	        				  qs.push(lcpconf.layerfields[id].fk_plant_id + " in ('" + query[key].join("','") + "')");
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