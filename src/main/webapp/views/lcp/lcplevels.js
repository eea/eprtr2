'use strict';

angular.module('myApp.lcplevels', ['ngRoute', 'myApp.search-filter', 'myApp.lcpdetails', 'myApp.lcpmap', 'restangular'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lcplevels', {
    templateUrl: 'views/lcp/lcplevels.html',
    controller: 'lcpLevelsCtrl'
  });
}])



.controller('lcpLevelsCtrl', ['$scope', '$filter', '$http', '$modal', 'searchFilter', 'Restangular', 'eprtrcms', 
                                 'lovCountryType', 'lovAreaGroupType', 'lovNutsRegionType','formatStrFactory', 'lcpDataService', 'lcpconf','eprtrmaps',
                                 function($scope, $filter, $http, $modal, searchFilter, Restangular, eprtrcms,
                                		 lovCountryType, lovAreaGroupType, lovNutsRegionType, formatStrFactory, lcpDataService, lcpconf,eprtrmaps) {
	
	$scope.beforesearch = true;
    $scope.areaFilter = false;
    $scope.searchFilter = searchFilter;
    $scope.queryParams = {};
    $scope.queryParams.ReportingYear = -1;
    
    //$scope.headline = "Large Combustion Plants (demo)";
    $scope.headitms = [];
    $scope.searchResults = false;
    $scope.basicidcountrycode = {};
    //$scope.cf = countFactory;
    $scope.ff = formatStrFactory;

    $scope.resize_icon = "fa fa-arrow-left"
    $scope.bigmap = false;
    $scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
    $scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    $scope.mapctrl = {};
	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -230)+'px';
	

//	Requesting text and title resources 
	eprtrcms.get('Facility',null).then(function (data) {
		$scope.tr_f = data;
	});
	eprtrcms.get('Common',null).then(function (data) {
		$scope.tr_c = data;
		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
	});
	eprtrcms.get('LCP',null).then(function (data) {
		$scope.tr_lcp = data;
	});
	eprtrcms.get('LOV_COUNTRY',null).then(function (data) {
		$scope.tr_lco = data;
	});
	eprtrcms.get('Confidentiality',null).then(function (data) {
		$scope.tr_con = data;
	});
	eprtrcms.get('LOV_NUTSREGION',null).then(function (data) {
		$scope.tr_lnr = data;
	});
	eprtrmaps.get().then(function (data){
		$scope.mapurls = data;
	});
	$scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });
    
    /**
     * MAp handling*/
    $scope.togglemapview = function(){
    	if($scope.bigmap){
        	$scope.bigmap = false;
        	$scope.resize_icon = "fa fa-arrow-left"
        	$scope.mapclss = "col-md-4 col-md-push-8 minor-padding";
        	$scope.resclss = "col-md-8 col-md-pull-4 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowExpandedMap'];
    	}
    	else{
        	$scope.bigmap = true;
        	$scope.resize_icon = "fa fa-arrow-right"
        	$scope.mapclss = "col-md-12 minor-padding";
        	$scope.resclss = "col-md-12 minor-padding";
    		$scope.maptooltip = $scope.tr_c['ShowReducedMap'];
    	}
    	$scope.mapctrl.redraw();
    }
    
    $scope.active = {
    		plants: true
    };
    $scope.activateTab = function(tab) {
    	$scope.active = {}; //reset
    	$scope.active[tab] = true;
    };
    $scope.setActiveTab = function(tab) {
    	$scope.active[tab] = true;
    };
    $scope.active.pollutantrelease = true;

    $scope.createheader = function(){
    	$scope.headitms = [];
    	/* HEADER PART FOR ReleaseYear*/
    	$scope.headitms.push({'order':0, 'clss':'fdTitles', 'title':$scope.tr_c.Year, 'val':$scope.queryParams.ReportingYear});

    	/* HEADER PART FOR AREA*/
    	var area = {'order':1,	'clss':'fdTitles', 'title':$scope.tr_c.Area};
    	if($scope.queryParams.LOV_CountryID != undefined){
			lovCountryType.getByID($scope.queryParams.LOV_CountryID).get().then(function(data) {
				area.val = $scope.tr_lco[data.countryCode];
				$scope.headitms.push(area);
			});
    	}
    }
  
	$scope.search = function() {
		$scope.beforesearch = false;
        $scope.performBasicSearch();
    }
	
	$scope.performBasicSearch = function() {
		$scope.queryParams = {ReportingYear: $scope.searchFilter.selectedReportingYear.year, LcpCapacities:$scope.searchFilter.selectedLCPCapacities};
		$scope.lcpcapacities = $scope.searchFilter.selectedLCPCapacities;
		$scope.reportingYear = $scope.searchFilter.selectedReportingYear.year;
		$scope.countryCode = null;
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.countryId) {
            $scope.areaFilter = true;
            $scope.countryCode = $scope.searchFilter.selectedReportingCountry.countryId;
            /*$scope.queryParams.LOV_CountryID = $scope.searchFilter.selectedReportingCountry.countryId;
    		lovCountryType.getByID($scope.queryParams.LOV_CountryID).get().then(function(data) {
    			$scope.countryCode = data.countryCode;
    		});*/  
    	}
        if ($scope.searchFilter.selectedReportingCountry !== undefined && $scope.searchFilter.selectedReportingCountry.groupId) {
            $scope.areaFilter = true;
            $scope.queryParams.LOV_AreaGroupID = $scope.searchFilter.selectedReportingCountry.groupId;
            //If AreaGroup then we need list of country id
        }
        
        //$scope.queryParams = queryParams;
        $scope.headitms = [];
        $scope.createheader();
	}
	
    $scope.$watchCollection('[countryCode,reportingYear,lcpcapacities,mapurls]', function(newvalue,oldvalue) {
    	if($scope.queryParams && $scope.queryParams.ReportingYear != -1 && $scope.mapurls){
    		//if(($scope.areaFilter && $scope.countryCode) || (!$scope.areaFilter && $scope.countryCode == undefined)){
    			if($scope.countryCode){
    				$scope.queryParams.countryCode = $scope.countryCode;
    			}
    			/*if($scope.regionCode){
    				$scope.queryParams.regionCode = $scope.regionCode;
    			}*/
    	        lcpDataService.get($scope.mapurls.lcpUrl,1,$scope.queryParams).then(function (data) {
    	        	$scope.basicdata = [];
    	        	var _basicitems = {};
    	        	if(data){
    	        		if(typeof data.features !== 'string' && data.features.length > 1){
	    	        		var _mem, _rel, _recent, _id;
		    	        	angular.forEach(data.features, function(item) {
		    	        		_id = item.attributes[lcpconf.layerfields[1].id];
		    	        		_mem = item.attributes[lcpconf.layerfields[1].memberstate];
		    	        		_rel = item.attributes[lcpconf.layerfields[1].envelope_isreleased];
		    	        		_recent = item.attributes[lcpconf.layerfields[1].most_recent_report];
		    	        		if(!_basicitems[_mem]){
			    	        		_basicitems[_mem] = {'id':_id,'rel': _rel, 'recent':_recent};
		    	        		}
		    	        		else{
		    	        			if(_rel === '1' && _recent > _basicitems[_mem].recent){
		    	        				_basicitems[_mem] = {'id':_id,'rel': _rel, 'recent':_recent};
		    	        			}
		    	        		}
		    	        	});
		    	        	angular.forEach(data.features, function(item) {
		    	        		if (item.attributes[lcpconf.layerfields[1].id] == _basicitems[item.attributes[lcpconf.layerfields[1].memberstate]].id){
		    	        			$scope.basicdata.push(item);
		    	        		}
		    	        	});
    	        		}
    	        		else{
    	        			$scope.basicdata = data.features;
    	        		}
    	        	}
   // 				$scope.basicdata = data.features;
    	        });

    	        
    		//}
	        $scope.searchResults = true;
    	}
    });
	
    $scope.$watchCollection('[basicdata,mapurls]', function(value) {
    	if($scope.basicdata && $scope.mapurls){
    		$scope.basicidcountrycode = {};
    		var _que = {}, _cou = -1;
    		if (typeof $scope.basicdata !== 'string'){
    			_cou = $scope.basicdata.length;
        		if (_cou >1){
        			var _basicids = [];
        			angular.forEach($scope.basicdata, function(item) {
        				var _id = item.attributes[lcpconf.layerfields[1].id];
        				var _cc = item.attributes[lcpconf.layerfields[1].memberstate];
        				_basicids.push(_id);
        				$scope.basicidcountrycode[_id] = _cc;
        			});
        			_que.BasicGroup = _basicids;
        			$scope.queryParams.BasicGroup = _basicids;
        		}
        		else if (_cou == 1){
        			_que.BasicID = $scope.basicdata[0].attributes[lcpconf.layerfields[1].id];
        			$scope.queryParams.BasicID = _que.BasicID;
    				$scope.basicidcountrycode[_que.BasicID] = $scope.basicdata[0].attributes[lcpconf.layerfields[1].memberstate];
        		}
        		/*if($scope.regionCode && (!$scope.regionCodes || $scope.regionCodes.length == 0)){
    				_que.regionCode = $scope.regionCode;
        		}
        		if($scope.regionCodes && $scope.regionCodes.length > 0){
        			_que.regionCodes = $scope.regionCodes;
        		}*/
    		}
    		$scope.mapQuery = _que;
    		if(!jQuery.isEmptyObject(_que)){
                lcpDataService.get($scope.mapurls.lcpUrl,0,_que).then(function (data) {
                	if($scope.lcpcapacities == 'all'){
                		$scope.formatPlantdata(data.features);
                	}
                	else{
                		var _oids = []; 
                		var _pids = []; 
                		//Add capabilities filter
                		angular.forEach(data.features, function(item) {
                			_oids.push(item.attributes[lcpconf.layerfields[0].id]);
                		});
                		var _qp;
            			switch ($scope.lcpcapacities) {
            			  case '300_up':
            			    _qp = "MWth > 300";
            			    break;
            			  case '100_300':
              			    _qp = "MWth BETWEEN 100 AND 300";
              			    break;
            			  case '50_100':
              			    _qp = "MWth BETWEEN 50 AND 100";
              			    break;
            			}
            			var _qstring = $scope.mapurls.lcpUrl + "/0/queryRelatedRecords?objectIds="+ _oids.join(",") 
            			+"&definitionExpression=" + _qp
            			+"&relationshipId=3&outFields="+ lcpconf.layerfields[5].fk_plant_id +"&f=pjson";

            			//Request years
            			$http.get(_qstring).success(function(data, status, headers, config) {
            				angular.forEach(data.relatedRecordGroups, function(plantdetails) {
                        		_pids.push(plantdetails.relatedRecords[0].attributes[lcpconf.layerfields[5].fk_plant_id]); 
            				});
            				//Recall Plants
            				var _que2 = {'PlantGroup':_pids};
            				$scope.mapQuery = _que2;
        	                lcpDataService.get($scope.mapurls.lcpUrl,0,_que2).then(function (data2) {
    	                		$scope.formatPlantdata(data2.features);
    	                	});
        				});
                		
                	}
                });
    		}
    		else{
    			$scope.plantdata = [];
    			$scope.queryParams.BasicID = '';
    		}
    	}
    });

    $scope.formatPlantdata = function(plantdata){
    	$scope.plantdata = [];
		angular.forEach(plantdata, function(item) {
			var _pl = {'plantid':item.attributes[lcpconf.layerfields[0].plantid]};
			_pl['id'] = item.attributes[lcpconf.layerfields[0].uniqueplantid];
			//_pl['id'] = item.attributes[lcpconf.layerfields[0].id];
			_pl['facility'] = item.attributes[lcpconf.layerfields[0].facilityname];
			_pl['plant'] = item.attributes[lcpconf.layerfields[0].plantname];
			_pl['address'] = (item.attributes[lcpconf.layerfields[0].address2])?
					item.attributes[lcpconf.layerfields[0].address1] + ', ' + item.attributes[lcpconf.layerfields[0].address2]:
					item.attributes[lcpconf.layerfields[0].address1];
			_pl['city'] = item.attributes[lcpconf.layerfields[0].city];
			_pl['region'] = item.attributes[lcpconf.layerfields[0].region];
			_pl['postalcode'] = item.attributes[lcpconf.layerfields[0].postalcode];
			_pl['country'] = $scope.basicidcountrycode[item.attributes[lcpconf.layerfields[0].fk_basicdata_id]];
			if(item.attributes[lcpconf.layerfields[0].address1]){
				//console.log('Adrrss');
			}
			$scope.plantdata.push(_pl);
		});
    }
	
	$scope.ldopen = function(plantid){
    	var modalInstance = $modal.open({
            templateUrl: 'components/lcp/lcpmodal.html',
            controller: 'ModalLcpCtrl',
            size: 'lg',
//            size: size,
            resolve: {
          	  plantid: function () {
          		  return plantid;
          	  }       
            }
          });
    };
}])


;