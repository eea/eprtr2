'use strict';

angular.module('myApp.fd-main', ['ngRoute','restangular','myApp.esrileafmap'])

.controller('FDMainController', 
		['$scope', '$http', '$filter', 'fdDetailsType', 'fdUnitType',
		 'lovCountryType', 'fdNaceActivityType', 'nutsRegionType', 'fdRiverBasinType',
		 'lovConfidentialType','fdAuthorityType',
          function($scope, $http, $filter, fdDetailsType, fdUnitType, lovCountryType, 
        		  fdNaceActivityType, nutsRegionType, fdRiverBasinType, lovConfidentialType,
        		  fdAuthorityType) {
	$scope.fdtitle = 'Facility Level';
	$scope.headitms = [];
	$scope.infoitms = [{'order':0,	'clss':'fdTitles', 	'title':'Facility Details',	'val': ' '}];
	$scope.infoitms2 = [];
	var degrees = "°";
	//    $scope.frID;

	if ($scope.frid !== undefined){
		$scope.map = {wh : {'FacilityReportID': $scope.frid}};
		fdDetailsType.get($scope.frid).get().then(function (data) {
			$scope.details = data;
        });
		fdAuthorityType.get($scope.frid).get().then(function(data) {
			 $scope.authority = data;
		});

	}
	
	
	$scope.$watch('details', function() {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined){
			if($scope.country === undefined){
				lovCountryType.get($scope.details.countryCode).get().then(function (data) {
					$scope.country = data;
					//console.log('details.country: ' + JSON.stringify($scope.details.country));
				});
			}
			if($scope.nuts === undefined){
				if ($scope.details.nutsregionSourceCode != undefined && $scope.details.nutsregionSourceCode != '' ){
					var nuts = {}
					nutsRegionType.get($scope.details.nutsregionSourceCode).get().then(function (data) {
						nuts.nutsregionSourceCode = data.code;
						nuts.nutsregionSourceName = data.name;
						
						if ($scope.details.nutsregionLevel2Code != undefined && $scope.details.nutsregionLevel2Code != '' ){
							nutsRegionType.get($scope.details.nutsregionLevel2Code).get().then(function (data) {
								nuts.nutsregionLevel2Code = data.code;
								nuts.nutsregionLevel2Name = data.name;
								$scope.nuts = nuts;
							});
						}
						else{
							$scope.nuts = nuts;
						}

					//console.log('details.country: ' + JSON.stringify($scope.details.country));
					});
				}
				else if ($scope.details.nutsregionLevel2Code != undefined && $scope.details.nutsregionLevel2Code != '' ){
					nutsRegionType.get($scope.details.nutsregionLevel2Code).get().then(function (data) {
						$scope.nuts = {};
						$scope.nuts.nutsregionLevel2Code = data.code;
						$scope.nuts.nutsregionLevel2Name = data.name;
					});
				}
			}
			if($scope.river === undefined){
				if ($scope.details.riverBasinDistrictCode != undefined && $scope.details.riverBasinDistrictCode != '' ){
					var river = {}
					fdRiverBasinType.get($scope.details.riverBasinDistrictCode).get().then(function (data) {
						river.riverBasinDistrictCode = data.code;
						river.riverBasinDistrictName = data.name;
						
						if ($scope.details.riverBasinDistrictSourceCode != undefined && $scope.details.riverBasinDistrictSourceCode != '' ){
							fdRiverBasinType.get($scope.details.riverBasinDistrictSourceCode).get().then(function (data) {
								river.riverBasinDistrictSourceCode = data.code;
								river.riverBasinDistrictSourceNAme = data.name;
								$scope.river = river;
							});
						}
						else{
							$scope.river = river;
						}

					//console.log('details.country: ' + JSON.stringify($scope.details.country));
					});
				}
				else if ($scope.details.riverBasinDistrictSourceCode != undefined && $scope.details.riverBasinDistrictSourceCode != '' ){
					fdRiverBasinType.get($scope.details.riverBasinDistrictSourceCode).get().then(function (data) {
						$scope.river = {};
						$scope.river.riverBasinDistrictSourceCode = data.code;
						$scope.river.riverBasinDistrictSourceName = data.name;
					});
				}
			}
			if($scope.nace === undefined){
		        var naceCode = $scope.details.nacesubActivityCode != ''? $scope.details.nacesubActivityCode  : $scope.details.naceactivityCode;
				console.log('nacecode: ' + naceCode);
				fdNaceActivityType.get(naceCode).get().then(function(data) {
					 $scope.nace = data;
				});
				console.log('nace: ' + JSON.stringify($scope.nace));
				/*.then(function (data) {
					$scope.nace = data;
					console.log('nace: ' + JSON.stringify($scope.nace));
				});*/
			}

			if($scope.unit === undefined){
				fdUnitType.get($scope.details.productionVolumeUnitCode).get().then(function(data) {
					 $scope.unit = data;
				});
			}

			if($scope.confidential === undefined && $scope.details.confidentialIndicator){
				lovConfidentialType.get($scope.details.confidentialIndicatorCode).get().then(function(data) {
					 $scope.confidential = data;
				});
			}
			
			$scope.headitms = [
	                  			{'order':0,	'clss':'fdTitles',
	                  				'title':'Facility',
	                  				'val': $scope.details.facilityName
	                  			},
	                  			{'order':1, 'clss':'fdTitles',
	                  				'title':'Address',
	                  				'val': $scope.details.address + " ," +  $scope.details.postalCode + " ," +  $scope.details.city
	                  			},
/*	                  			{'order':2,'clss':'fdTitles',
	                  				'title':'Country',
	                  				'val': $scope.country.countryName
	                  			},*/
	                  			{'order':3,'clss':'fdTitles',
	                  				'title':'Year',
	                  				'val': $scope.details.reportingYear +  " (published: " + $filter('date')($scope.details.published, "dd MMM yyyy") + ")"
	                  			},
	                  			{'order':4,'clss':'fdTitles',
	                  				'title':'Regulation',
	                  				'val': $scope.details.reportingYear < 2007 ? "EPER Regulation" : "E-PRTR Regulation"
	                  			}];
			
			
			
			$scope.infoitms.push({'order':1, 'clss':'fdSubTitles', 	
				'title':'Parent Company Name', 
				'val': $scope.details.confidentialIndicator ? 'CONFIDENTIAL' : $scope.details.parentCompanyName
			});

			var crd = $scope.details.coordinates.replace('POINT','').replace('(','').replace(')','').trim().split(' ');
			$scope.infoitms.push({'order':2, 'clss':'fdSubTitles', 	
				'title':'Coordinates (Lon;Lat)', 'val': "("+crd[0]+degrees+", "+crd[1]+degrees+")"});

			//No. of IPPC installations is voluntary. Only add if reported.
	        if ($scope.details.totalIPPCInstallationQuantity != '' && $scope.details.totalIPPCInstallationQuantity !== undefined)
	        {
				$scope.infoitms.push({'order':9, 'clss':'fdSubTitles', 	
					'title':'IPPC Installations', 'val': $filter('number')($scope.details.totalIPPCInstallationQuantity)});
	        }

	        //No. of emplyees is voluntary. Only add if reported.
	        if ($scope.details.totalEmployeeQuantity != '' && $scope.details.totalEmployeeQuantity !== undefined)
	        {
				$scope.infoitms.push({'order':10, 'clss':'fdSubTitles', 	
					'title':'TotalEmployeeQuantity', 'val': $filter('number')($scope.details.totalEmployeeQuantity)});
	        }

	        //Operating hours is voluntary. Only add if reported.
	        if ($scope.details.operatingHours != '' && $scope.details.operatingHours !== undefined)
	        {
				$scope.infoitms.push({'order':11, 'clss':'fdSubTitles', 	
					'title':'Operating hours', 'val': $scope.details.operatingHours});
	        }

	        //Website is voluntary. Only add if reported.
	        if ($scope.details.websiteCommunication != '' && $scope.details.websiteCommunication !== undefined)
	        {
				$scope.infoitms.push({'order':12, 'clss':'fdSubTitles', 	
					'title':'Website', 'val': $scope.details.websiteCommunication});
	        }

	        if ($scope.details.nationalID != '' && $scope.details.nationalID !== undefined)
	        {
				$scope.infoitms.push({'order':14, 'clss':'fdSubTitles', 	
					'title':'National ID', 'val': $scope.details.nationalID + ' (in '+ $scope.details.reportingYear +')'});
	        }

		}
    });

	$scope.$watch('country', function(value) {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){
			if($scope.country !== undefined){
//				console.log('details.country: ' + JSON.stringify($scope.details.country));
				//Build headitems list
				$scope.headitms.push({'order':2,'clss':'fdTitles',
		                  				'title':'Country',
		                  				'val': $scope.country.countryName
		                  			});
			}
		}
	});
	
	$scope.$watch('nuts', function(value) {
		if($scope.details !== undefined){
			if($scope.nuts !== undefined){
				//NUTS Region$scope.nuts.nutsregionLevel2Name
				if($scope.nuts.nutsregionSourceCode != undefined){
					if ($scope.nuts.nutsregionSourceCode != $scope.nuts.nutsregionLevel2Code){
						$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
							'title':'NUTS Region (Map)', 'val': $scope.nuts.nutsregionLevel2Name});
						$scope.infoitms.push({'order':4, 'clss':'fdSubTitles', 	
							'title':'NUTS Region (Reported)', 'val': $scope.nuts.nutsregionSourceName});
						
					}
					else {
						$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
							'title':'NUTS', 'val': $scope.nuts.nutsregionLevel2Name});
					}
					
				}
				else {
					if($scope.nuts.nutsregionLevel2Code != '')
					$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
						'title':'NUTS', 'val': $scope.nuts.nutsregionLevel2Name});
				}
			}
		}
	});

	$scope.$watch('river', function(value) {
		if($scope.details !== undefined && $scope.details.riverBasinDistrictCode !== undefined ){
			if($scope.river !== undefined){
		        //Add both reported and geo-coded value - if they differ.
		        if ($scope.river.riverBasinDistrictSourceCode != $scope.river.riverBasinDistrictCode)
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':'River Basin District (Map)', 'val': $scope.river.riverBasinDistrictName});
					$scope.infoitms.push({'order':6, 'clss':'fdSubTitles', 	
						'title':'River Basin District (Reported)', 'val': $scope.river.riverBasinDistrictSourceName});
		        }
		        else
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':'River Basin District', 'val': $scope.river.riverBasinDistrictName});
		        }
			}
		}
	});

	$scope.$watch('nace', function(value) {
		if($scope.details !== undefined && $scope.details.naceactivityCode !== undefined ){

			if($scope.nace !== undefined){
		        //NACE code reported on sub-activity level, except for EPER where some is reported on Activity level
		        //var naceCode = $scope.nace.nacesubActivityCode ? $scope.nace.NACESubActivityCode != '' : $scope.nace.NACEActivityCode;
				$scope.infoitms.push({'order':7, 'clss':'fdSubTitles', 	
					'title':'Main activity (NACE)', 'val': $scope.nace.name});
			}
		}
	});
	
	$scope.$watch('unit', function(value) {
		if($scope.details !== undefined){
			if($scope.unit !== undefined){
		        //Production volume is voluntary. Only add if reported.
		        if ($scope.details.productionVolumeQuantity != '' && $scope.details.productionVolumeQuantity !== undefined)
		        {
					$scope.infoitms.push({'order':8, 'clss':'fdSubTitles', 	
						'title':'Production volume', 
						'val': $scope.details.productionVolumeProductName + ' ' + 
						$filter('number')($scope.details.productionVolumeQuantity) 
						+ ' ' + $scope.unit.name});
						//TODO LOVResources.UnitName(fac.ProductionVolumeUnitCode))));
		        }
			}
		}
	});
	
			
	$scope.$watch('confidential', function(value) {
		if($scope.details !== undefined && $scope.details.confidentialIndicator){
	        if ($scope.confidential !== undefined)
	        {
				$scope.infoitms.push({'order':13, 'clss':'fdSubTitles', 	
					'title':'Confidentiality Reason', 'val': $scope.confidential.name});
	        }
		}
	});

		        
    /*
     * Part 2 of InfoItems
     * */
	$scope.$watch('authority', function(value) {
        if ($scope.authority !== undefined){
        	var upddate = $scope.authority.calastUpdate !== undefined ? $filter('date')($scope.authority.calastUpdate, "dd MMM yyyy") : 'Unknown';
			$scope.infoitms2 = [{'order':0,	'clss':'fdTitles', 	'title':'Competent Authority',	'val': '(Last updated: '+ upddate +')'}];
				

	        if ($scope.authority.caname != '' && $scope.authority.caname !== undefined)
	        {
				$scope.infoitms2.push({'order':1, 'clss':'fdSubTitles', 	
					'title':'Name', 'val': $scope.authority.caname});
	        }

	        if ($scope.authority.caaddress != '' && $scope.authority.caaddress !== undefined)
	        {
				$scope.infoitms2.push({'order':2, 'clss':'fdSubTitles', 	
					'title':'Address', 'val': $scope.authority.caaddress  + ", " +  $scope.authority.capostalCode + ", " +  $scope.authority.cacity});
	        }

	        if ($scope.authority.catelephoneCommunication != '' && $scope.authority.catelephoneCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':3, 'clss':'fdSubTitles', 	
					'title':'Phone', 'val': $scope.authority.catelephoneCommunication});
	        }

	        if ($scope.authority.cafaxCommunication != '' && $scope.authority.cafaxCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':4, 'clss':'fdSubTitles', 	
					'title':'Fax', 'val': $scope.authority.cafaxCommunication});
	        }

	        if ($scope.authority.caemailCommunication != '' && $scope.authority.caemailCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':5, 'clss':'fdSubTitles', 	
					'title':'E-mail', 'val': $scope.authority.caemailCommunication});
	        }

	        if ($scope.authority.cacontactPersonName != '' && $scope.authority.cacontactPersonName !== undefined)
	        {
				$scope.infoitms2.push({'order':6, 'clss':'fdSubTitles', 	
					'title':'Contact Person', 'val': $scope.authority.cacontactPersonName});
	        }

		}
    });

//      console.log('Res: ' + JSON.stringify( data));

    	 
	 

}])

.factory('fdDetailsType', ['fdDetailsService', function(fdDetailsService) {
        return {
            get : function(fdrid) {
                /*var params = {};
                if (fdrid !== undefined) {
                    params = {FacilityReportID: fdrid};
                }*/
                return fdDetailsService.one(fdrid);
            }
        };
    }])

.factory('lovCountryType', ['lovCountryService', function(lovCountryService) {
        return {
            get : function(countryCode) {
                return lovCountryService.one(countryCode);
            }
        };
    }])

.factory('fdNaceActivityType', ['naceActivityService', function(naceActivityService) {
        return {
            get : function(naceCode) {
/*                var params = {};
                if (naceCode !== undefined) {
                    params = {naceCode: naceCode};
                }*/

                return naceActivityService.one(naceCode);
            }
        };
    }])
.factory('fdRiverBasinType', ['fdRiverBasinService', function(fdRiverBasinService) {
    return {
        get : function(riverBasinCode) {
            return fdRiverBasinService.one(riverBasinCode);
        }
    };
}])

.factory('nutsRegionType', ['nutsRegionService', function(nutsRegionService) {
        return {
            get : function(nutsRegionCode) {
                return nutsRegionService.one(nutsRegionCode);
            }
        };
    }])

.factory('fdUnitType', ['lovUnitService', function(lovUnitService) {
        return {
            get : function(unitCode) {
                return lovUnitService.one(unitCode);
            }
        };
    }])

.factory('lovConfidentialType', ['lovConfidentialService', function(lovConfidentialService) {
        return {
            get : function(confidentialCode) {
                return lovConfidentialService.one(confidentialCode);
            }
        };
    }])

.factory('fdAuthorityType', ['fdAuthorityService', function(fdAuthorityService) {
    return {
        get : function(fdrid) {
            return fdAuthorityService.one(fdrid);
        }
    };
}])

.service('fdAuthorityService', ['Restangular', function(Restangular){
    var fdAuthority = Restangular.service('facilitydetailAuthority');

    Restangular.extendModel('facilitydetailAuthority', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdAuthority;
}])

.service('fdDetailsService', ['Restangular', function(Restangular){
    var fdDetails = Restangular.service('facilitydetailDetails');

    Restangular.extendModel('facilitydetailDetails', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdDetails;
}])

.service('lovCountryService', ['Restangular', function(Restangular){
    var LovCountry = Restangular.service('lovCountry');

    Restangular.extendModel('lovCountry', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return LovCountry;
}])

.service('lovUnitService', ['Restangular', function(Restangular){
    var LovUnit = Restangular.service('lovUnit');

    Restangular.extendModel('lovUnit', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return LovUnit;
}])

.service('nutsRegionService', ['Restangular', function(Restangular){
    var nutsRegion = Restangular.service('nutsRegion');

    Restangular.extendModel('nutsRegion', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return nutsRegion;
}])

.service('lovConfidentialService', ['Restangular', function(Restangular){
    var lovConfidential = Restangular.service('lovConfidential');

    Restangular.extendModel('lovConfidential', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovConfidential;
}])

.service('fdRiverBasinService', ['Restangular', function(Restangular){
    var riverBasinDistricts = Restangular.service('riverBasinDistricts');

    Restangular.extendModel('riverBasinDistricts', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return riverBasinDistricts;
}])

/*
 * This directive enables us to define this module as a custom HTML element
 * <esri-leaf-map queryparams="" /> 
 * You can use only one of these parameters: 
 *    facility-report-id: Interesting in the facilitydetails view where we only focus on one facility
 *    wherestr: This has given me some problems because Angular wants to pass the string as an expression
 *    queryparams: a JSON oject with key, value pairs eg. {"ReportingYear":2008, "CountryCode":"NL"}    
 * */
.directive('facilityLevel', function() {
	return {
		restrict: 'E',
		controller: 'FDMainController',
        transclude: true,
		scope: {
			frid: '@facilityReportId'
		},
		templateUrl: 'components/facilitydetails/fd-main.html',
		link: function(scope, element, attrs){
			scope.$watch('frID', function() {
				console.log('FacilityReportID changed:' + scope.frid);
	        	//scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);
		}
	};
});