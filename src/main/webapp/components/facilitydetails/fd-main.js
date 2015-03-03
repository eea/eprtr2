'use strict';

angular.module('myApp.fd-main', ['ngRoute','restangular','myApp.esrileafmap'])

.controller('FDMainController', 
		['$scope', '$http', '$filter', 'translationService','fdDetailsType', 'fdAuthorityType', 
          function($scope, $http, $filter, translationService, fdDetailsType, fdAuthorityType) {
	$scope.fdtitle = 'Facility Level';
	$scope.headitms = [];
	$scope.infoitms = [{'order':0,	'clss':'fdTitles', 	'title':'Facility Details',	'val': ' '}];
	$scope.infoitms2 = [];
	var degrees = "°";
	//    $scope.frID;

	
//	Requesting text and title resources 
	translationService.get().then(function (data) {
		$scope.tr_f = data.Facility;
		$scope.tr_c = data.Common;
		$scope.tr_p = data.Pollutant;
		$scope.tr_lna = data.LOV_NACEACTIVITY;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_lu = data.LOV_UNIT;
		$scope.tr_lcf = data.LOV_CONFIDENTIALITY;
		$scope.tr_lco = data.LOV_COUNTRY;
    });
/*	translationService.get('Facility').then(function (data) {
		$scope.tr_f = data;
    });
	translationService.get('Common').then(function (data) {
		$scope.tr_c = data;
    });
	translationService.get('Pollutant').then(function (data) {
		$scope.tr_p = data;
    });
	translationService.get('LOV_NACEACTIVITY').then(function (data) {
		$scope.tr_lna = data;
    });
	translationService.get('LOV_NUTSREGION').then(function (data) {
		$scope.tr_lnr = data;
    });
	translationService.get('LOV_RIVERBASINDISTRICT').then(function (data) {
		$scope.tr_lrbd = data;
    });
	translationService.get('LOV_UNIT').then(function (data) {
		$scope.tr_lu = data;
    });
	translationService.get('LOV_CONFIDENTIALITY').then(function (data) {
		$scope.tr_lcf = data;
    });
	translationService.get('LOV_COUNTRY').then(function (data) {
		$scope.tr_lco = data;
    });*/
	

	$scope.updateByFdrid = function(){
		$scope.map = {wh : {'FacilityReportID': $scope.frid}};
		fdDetailsType.getByFdrID($scope.frid).get().then(function (data) {
			$scope.details = data;
			$scope.fid = data.facilityId;
			$scope.year = data.reportingYear;
        });
		fdAuthorityType.get($scope.frid).get().then(function(data) {
			 $scope.authority = data;
		});
	};
	$scope.updateByFdidAndyear = function(){
		$scope.map = {wh : {'FacilityID': $scope.fid, 'ReportingYear': $scope.year}};
		fdDetailsType.getByFdIDAndYear($scope.fid,$scope.year).then(function (details) {
			$scope.details = details[0];
			$scope.frid = details[0].facilityReportID;
			fdAuthorityType.get(details[0].facilityReportID).get().then(function(authority) {
				 $scope.authority = authority;
			});
        });
	};

	//Requesting values
	if ($scope.frid !== undefined && $scope.frid != null && $scope.frid != ''){
		$scope.updateByFdrid();
	}
	else if ($scope.fid != undefined && $scope.year != undefined && 
			 $scope.fid != null && $scope.year != null &&
			 $scope.fid != '' && $scope.year != ''){
		$scope.updateByFdidAndyear();
	}

 	$scope.$watchCollection('[tr_c,tr_f, details]', function(value) {
 		if ($scope.tr_c !== undefined && $scope.tr_f !== undefined && $scope.details !== undefined){
			$scope.headitms = [
	                  			{'order':0,	'clss':'fdTitles',
	                  				'title':$scope.tr_f.FacilityName,
	                  				'val': $scope.details.facilityName
	                  			},
	                  			{'order':1, 'clss':'fdTitles',
	                  				'title': $scope.tr_f.Address,
	                  				'val': $scope.details.address + " ," +  $scope.details.postalCode + " ," +  $scope.details.city
	                  			},
	/*	                  			{'order':2,'clss':'fdTitles',
		                  				'title':'Country',
		                  				'val': $scope.country.countryName
		                  			},*/
	                  			{'order':3,'clss':'fdTitles',
	                  				'title':$scope.tr_c.Year,
	                  				'val': $scope.details.reportingYear +  " (published: " + $filter('date')($scope.details.published, "dd MMM yyyy") + ")"
	                  			},
	                  			{'order':4,'clss':'fdTitles',
	                  				'title':$scope.tr_c.Regulation,
	                  				'val': $scope.details.reportingYear < 2007 ? "EPER Regulation" : "E-PRTR Regulation"
	                  			}];
			
			
			
			$scope.infoitms.push({'order':1, 'clss':'fdSubTitles', 	
				'title':$scope.tr_f.ParentCompanyName, 
				'val': $scope.details.confidentialIndicator ? 'CONFIDENTIAL' : $scope.details.parentCompanyName
			});
	
			var crd = $scope.details.coordinates.replace('POINT','').replace('(','').replace(')','').trim().split(' ');
			$scope.infoitms.push({'order':2, 'clss':'fdSubTitles', 	
				'title':$scope.tr_f.Coords, 'val': "("+crd[0]+degrees+", "+crd[1]+degrees+")"});
	
			//No. of IPPC installations is voluntary. Only add if reported.
	        if ($scope.details.totalIPPCInstallationQuantity != '' && $scope.details.totalIPPCInstallationQuantity != null)
	        {
				$scope.infoitms.push({'order':9, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.IPPC, 'val': $filter('number')($scope.details.totalIPPCInstallationQuantity)});
	        }
	
	        //No. of emplyees is voluntary. Only add if reported.
	        if ($scope.details.totalEmployeeQuantity != '' && $scope.details.totalEmployeeQuantity != null)
	        {
				$scope.infoitms.push({'order':10, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Employ, 'val': $filter('number')($scope.details.totalEmployeeQuantity)});
	        }
	
	        //Operating hours is voluntary. Only add if reported.
	        if ($scope.details.operatingHours != '' && $scope.details.operatingHours != null)
	        {
				$scope.infoitms.push({'order':11, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.OperationHours, 'val': $scope.details.operatingHours});
	        }
	
	        //Website is voluntary. Only add if reported.
	        if ($scope.details.websiteCommunication != '' && $scope.details.websiteCommunication != null)
	        {
				$scope.infoitms.push({'order':12, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.WebSite, 'val': $scope.details.websiteCommunication});
	        }
	
	        if ($scope.details.nationalID != '' && $scope.details.nationalID != null)
	        {
				$scope.infoitms.push({'order':14, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.NationalID, 'val': $scope.details.nationalID + ' (in '+ $scope.details.reportingYear +')'});
	        }
 		}
    });

 	$scope.$watchCollection('[tr_c, tr_lco, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_c !== undefined 
				&& $scope.details.countryCode !== undefined && $scope.tr_lco !== undefined){
			$scope.headitms.push({'order':2,'clss':'fdTitles',
	                  				'title':$scope.tr_c.Country,
	                  				'val': $scope.tr_lco[$scope.details.countryCode]
	                  			});
		}
	});
	
 	$scope.$watchCollection('[tr_f, tr_lnr, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_f !== undefined && $scope.tr_lnr !== undefined ){
			//NUTS Region$scope.nuts.nutsregionLevel2Name
			if ($scope.details.nutsregionSourceCode != undefined && $scope.details.nutsregionSourceCode != '' ){
				if ($scope.details.nutsregionSourceCode != $scope.details.nutsregionLevel2Code){
					$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.NUTSMap, 'val': $scope.tr_lnr[$scope.details.nutsregionLevel2Code]});
					$scope.infoitms.push({'order':4, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.NUTSReported, 'val': $scope.tr_lnr[$scope.details.nutsregionSourceCode]});
				}
				else {
					$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.NUTS, 'val': $scope.tr_lnr[$scope.details.nutsregionLevel2Code]});
				}
			}
			else {
				if($scope.details.nutsregionLevel2Code != '')
				$scope.infoitms.push({'order':3, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.NUTS, 'val':  $scope.tr_lnr[$scope.details.nutsregionLevel2Code]});
			}
		}
	});

 	$scope.$watchCollection('[tr_f, tr_lrbd, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_f !== undefined 
				&& $scope.details.riverBasinDistrictCode !== undefined && $scope.tr_lrbd !== undefined){
	        //Add both reported and geo-coded value - if they differ.

			if($scope.details.riverBasinDistrictSourceCode != 'UNKNOWN' 
				&& $scope.details.riverBasinDistrictSourceCode != null 
				&& $scope.details.riverBasinDistrictSourceCode != ''){
			
		        if ($scope.details.riverBasinDistrictSourceCode != $scope.details.riverBasinDistrictCode
		        		&& $scope.details.riverBasinDistrictCode != 'UNKNOWN' 
	        		&& $scope.details.riverBasinDistrictCode != null 
	        		&& $scope.details.riverBasinDistrictCode != '' )
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.RBDMap, 'val': $scope.tr_lrbd[$scope.details.riverBasinDistrictCode]});
					$scope.infoitms.push({'order':6, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.RBDReported, 'val': $scope.tr_lrbd[$scope.details.riverBasinDistrictSourceCode]});
		        }
		        else
		        {
					$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
						'title':$scope.tr_f.RBD, 'val': $scope.tr_lrbd[$scope.details.riverBasinDistrictSourceCode]});
		        }
			}
	        else
	        {
				$scope.infoitms.push({'order':5, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.RBD, 'val': $scope.tr_lrbd[$scope.details.riverBasinDistrictCode]});
	        }
		}
	
	});

 	$scope.$watchCollection('[tr_f, tr_lna, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_f !== undefined  && $scope.tr_lna !== undefined  
				&& $scope.details.naceactivityCode !== undefined){
	        //NACE code reported on sub-activity level, except for EPER where some is reported on Activity level
	        //var naceCode = $scope.nace.nacesubActivityCode ? $scope.nace.NACESubActivityCode != '' : $scope.nace.NACEActivityCode;
			var na_val = $scope.tr_lna[$scope.details.naceactivityCode];
			if ($scope.details.naceactivityCode.indexOf("NACE_1.1") > -1)
            {
				na_val += " (rev. 1.1.)";
            }
			$scope.infoitms.push({'order':7, 'clss':'fdSubTitles', 	
				'title':$scope.tr_f.NACE, 'val': na_val});
		}
	});
	
 	$scope.$watchCollection('[tr_f, tr_lu, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_f !== undefined 
				&& $scope.tr_lu !== undefined){
			if($scope.details.productionVolumeQuantity != '' 
				&& $scope.details.productionVolumeQuantity != null){
				var pv_val = $scope.details.productionVolumeProductName + ' ' + 
				$filter('number')($scope.details.productionVolumeQuantity);
				if ($scope.details.productionVolumeUnitCode != undefined &&
						$scope.details.productionVolumeUnitCode != '' ){
					pv_val += ' ' + $scope.tr_lu[$scope.details.productionVolumeUnitCode];
				}
				$scope.infoitms.push({'order':8, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.ProductionV, 
					'val': pv_val });
					//TODO LOVResources.UnitName(fac.ProductionVolumeUnitCode))));
	        }
		}
	});
	
 	$scope.$watchCollection('[tr_p, tr_lcf, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_f !== undefined 
				&& $scope.details.confidentialIndicator 
				&& $scope.tr_lcf !== undefined){
			$scope.infoitms.push({'order':13, 'clss':'fdSubTitles', 	
				'title':$scope.tr_p.ConfidentialityReason, 'val': $scope.tr_lcf[$scope.details.confidentialIndicatorCode]});
        }
	});

		        
    /*
     * Part 2 of InfoItems
     * */
 	$scope.$watchCollection('[tr_f, authority]', function(value) {
		if($scope.authority !== undefined && $scope.tr_f !== undefined){
        	var upddate = ($scope.authority.calastUpdate != undefined 
            		&& $scope.authority.calastUpdate != null 
            		&& $scope.authority.calastUpdate != '') ? $filter('date')($scope.authority.calastUpdate, "dd MMM yyyy") : 'Unknown';
			$scope.infoitms2 = [{'order':0,	'clss':'fdTitles', 	'title':$scope.tr_f.CompetentA,	'val': '(Last updated: '+ upddate +')'}];
				

	        if ($scope.authority.caname != '' && $scope.authority.caname !== undefined)
	        {
				$scope.infoitms2.push({'order':1, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Name, 'val': $scope.authority.caname});
	        }

	        if ($scope.authority.caaddress != '' && $scope.authority.caaddress !== undefined)
	        {
				$scope.infoitms2.push({'order':2, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Address, 'val': $scope.authority.caaddress  + ", " +  $scope.authority.capostalCode + ", " +  $scope.authority.cacity});
	        }

	        if ($scope.authority.catelephoneCommunication != '' && $scope.authority.catelephoneCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':3, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Phone, 'val': $scope.authority.catelephoneCommunication});
	        }

	        if ($scope.authority.cafaxCommunication != '' && $scope.authority.cafaxCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':4, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Fax, 'val': $scope.authority.cafaxCommunication});
	        }

	        if ($scope.authority.caemailCommunication != '' && $scope.authority.caemailCommunication !== undefined)
	        {
				$scope.infoitms2.push({'order':5, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.Email, 'val': $scope.authority.caemailCommunication});
	        }

	        if ($scope.authority.cacontactPersonName != '' && $scope.authority.cacontactPersonName !== undefined)
	        {
				$scope.infoitms2.push({'order':6, 'clss':'fdSubTitles', 	
					'title':$scope.tr_f.CPerson, 'val': $scope.authority.cacontactPersonName});
	        }

		}
    });

}])

/*
 * Factories
 * */
.factory('fdDetailsType', ['fdDetailsService', function(fdDetailsService) {
        return {
            getByFdrID : function(fdrid) {
                return fdDetailsService.one(fdrid);
            },
	        getByFdIDAndYear : function(fdid, year) {
	        	var params = {};
	        	params.FacilityID = fdid;
	        	params.ReportingYear = year;
	        	//return Restangular.all('facilitydetailDetails').get(params);
	            return fdDetailsService.getList(params);
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

/*
 * Services
 * */
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
			frid: '@facilityReportId',
			fid: '@facilityId',
			year: '@reportingYear'
		},
		templateUrl: 'components/facilitydetails/fd-main.html',
		link: function(scope, element, attrs){
			scope.$watchCollection('[frid, fid, year]', function() {
				console.log('FacilityReportID changed:' + scope.frid);
	        	//scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);
		}
	};
});