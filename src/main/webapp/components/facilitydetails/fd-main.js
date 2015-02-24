'use strict';

angular.module('myApp.fd-main', ['ngRoute','restangular','myApp.esrileafmap'])

.controller('FDMainController', 
		['$scope', '$http', '$filter', 'fdDetailsType', 
		 'lovCountryType', 'fdNaceActivityType', 'nutsRegionType', 
          function($scope, $http, $filter, fdDetailsType, lovCountryType, 
        		  fdNaceActivityType, nutsRegionType) {
	$scope.fdtitle = 'Facility Level';
	$scope.headitms = [];
	$scope.infoitms = [{'order':0,	'clss':'fdTitles', 	'title':'Facility Details',	'val': ' '}];
	$scope.infoitms2 = [];
	//    $scope.frID;

	if ($scope.frid !== undefined){
		$scope.map = {wh : {'FacilityReportID': $scope.frid}};
		fdDetailsType.get($scope.frid).get().then(function (data) {
			$scope.details = data;
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
/*				if ($scope.nuts.nutsregionSourceCode != $scope.nuts.nutsregionLevel2Code){
					$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
						'title':'NUTS Region (Map)', 'val': $scope.nuts.nutsregionLevel2Name});
					$scope.infoitms.push({'order':4, 'clss':'fdSubTitles', 	
						'title':'NUTS Region (Reported)', 'val': $scope.nuts.nutsregionSourceName});

*/
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
	                  				'val': $scope.details.facilityID
	                  			}];
			
			$scope.infoitms.push({'order':1, 'clss':'fdSubTitles', 	
				'title':'Parent Company Name', 
				'val': $scope.details.confidentialIndicator ? 'CONFIDENTIAL' : $scope.details.parentCompanyName
			});

			$scope.infoitms.push({'order':2, 'clss':'fdSubTitles', 	
				'title':'Coordinates (Lon;Lat)', 'val': $scope.details.coordinates.replace('POINT','')});

			//No. of IPPC installations is voluntary. Only add if reported.
	        if ($scope.details.TotalIPPCInstallationQuantity != '' && $scope.details.TotalIPPCInstallationQuantity !== undefined)
	        {
				$scope.infoitms.push({'order':9, 'clss':'fdSubTitles', 	
					'title':'IPPC Installations', 'val': $scope.details.TotalIPPCInstallationQuantity});
	        }

	        //No. of emplyees is voluntary. Only add if reported.
	        if ($scope.details.TotalEmployeeQuantity != '' && $scope.details.TotalEmployeeQuantity !== undefined)
	        {
				$scope.infoitms.push({'order':10, 'clss':'fdSubTitles', 	
					'title':'TotalEmployeeQuantity', 'val': $scope.details.TotalEmployeeQuantity});
	        }

	        //Operating hours is voluntary. Only add if reported.
	        if ($scope.details.OperatingHours != '' && $scope.details.OperatingHours !== undefined)
	        {
				$scope.infoitms.push({'order':11, 'clss':'fdSubTitles', 	
					'title':'Operating hours', 'val': $scope.details.OperatingHours});
	        }

	        //Website is voluntary. Only add if reported.
	        if ($scope.details.WebsiteCommunication != '' && $scope.details.WebsiteCommunication !== undefined)
	        {
				$scope.infoitms.push({'order':12, 'clss':'fdSubTitles', 	
					'title':'Website', 'val': $scope.details.WebsiteCommunication});
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
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){
			if($scope.river !== undefined){
		        //Add both reported and geo-coded value - if they differ.
		        if ($scope.river.RiverBasinDistrictSourceCode != $scope.river.RiverBasinDistrictCode)
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':'River Basin District (Map)', 'val': $scope.river.RiverBasinDistrictName});
					$scope.infoitms.push({'order':6, 'clss':'fdSubTitles', 	
						'title':'River Basin District (Reported)', 'val': $scope.river.RiverBasinDistrictSourceName});
		        }
		        else
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':'River Basin District', 'val': $scope.river.RiverBasinDistrictName});
		        }
			}
		}
	});

	$scope.$watch('nace', function(value) {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){

			if($scope.nace !== undefined){
		        //NACE code reported on sub-activity level, except for EPER where some is reported on Activity level
		        //var naceCode = $scope.nace.nacesubActivityCode ? $scope.nace.NACESubActivityCode != '' : $scope.nace.NACEActivityCode;
				$scope.infoitms.push({'order':7, 'clss':'fdSubTitles', 	
					'title':'Main activity (NACE)', 'val': $scope.nace.name});
			}
		}
	});
	
	$scope.$watch('unit', function(value) {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){

			if($scope.unit !== undefined){

		        //Production volume is voluntary. Only add if reported.
		        if ($scope.details.ProductionVolumeQuantity != '' && $scope.details.ProductionVolumeQuantity !== undefined)
		        {
					$scope.infoitms.push({'order':8, 'clss':'fdSubTitles', 	
						'title':'ProductionVolumeQuantity', 
						'val': $scope.details.ProductionVolumeProductName + ' ' + $scope.details.ProductionVolumeQuantity + ' ' + $scope.unit.unitName});
						//TODO LOVResources.UnitName(fac.ProductionVolumeUnitCode))));
		        }
			}
		}
	});
	
			
	$scope.$watch('confidential', function(value) {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){

	        if ($scope.confidential !== undefined)
	        {
				$scope.infoitms.push({'order':13, 'clss':'fdSubTitles', 	
					'title':'ConfidentialityReason', 'val': $scope.confidential.ConfidentialIndicatorReason});
	        }
		}
	});

		        
    /*
     * Part 2 of InfoItems
     * */
	$scope.$watch('authority', function(value) {
		if($scope.details !== undefined && $scope.details.countryCode !== undefined ){

	        if ($scope.authority !== undefined){
	        	var upddate = $filter('date')($scope.authority.CALastUpdate, "dd MMM yyyy") ? $scope.authority.CALastUpdate !== undefined : 'Unknown';
				$scope.infoitms2 = [{'order':0,	'clss':'fdTitles', 	'title':'Competent Authority',	'val': '(Last updated: '+ upddate +')'}];
					

		        if ($scope.authority.CAName != '' && $scope.authority.CAName !== undefined)
		        {
					$scope.infoitms2.push({'order':1, 'clss':'fdSubTitles', 	
						'title':'Name', 'val': $scope.authority.CAName});
		        }

		        if ($scope.authority.CAAddress != '' && $scope.authority.CAAddress !== undefined)
		        {
					$scope.infoitms2.push({'order':2, 'clss':'fdSubTitles', 	
						'title':'Address', 'val': $scope.authority.CAAddress  + " ," +  $scope.authority.CAPostalCode + " ," +  $scope.authority.CACity});
		        }

		        if ($scope.authority.CATelephoneCommunication != '' && $scope.authority.CATelephoneCommunication !== undefined)
		        {
					$scope.infoitms2.push({'order':3, 'clss':'fdSubTitles', 	
						'title':'Phone', 'val': $scope.authority.CATelephoneCommunication});
		        }

		        if ($scope.authority.CAFaxCommunication != '' && $scope.authority.CAFaxCommunication !== undefined)
		        {
					$scope.infoitms2.push({'order':4, 'clss':'fdSubTitles', 	
						'title':'Fax', 'val': $scope.authority.CAFaxCommunication});
		        }

		        if ($scope.authority.CAEmailCommunication != '' && $scope.authority.CAEmailCommunication !== undefined)
		        {
					$scope.infoitms2.push({'order':5, 'clss':'fdSubTitles', 	
						'title':'E-mail', 'val': $scope.authority.CAEmailCommunication});
		        }

		        if ($scope.authority.CAContactPersonName != '' && $scope.authority.CAContactPersonName !== undefined)
		        {
					$scope.infoitms2.push({'order':6, 'clss':'fdSubTitles', 	
						'title':'Contact Person', 'val': $scope.authority.CAContactPersonName});
		        }

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

.factory('nutsRegionType', ['nutsRegionService', function(nutsRegionService) {
        return {
            get : function(nutsRegionCode) {
                return nutsRegionService.one(nutsRegionCode);
            }
        };
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