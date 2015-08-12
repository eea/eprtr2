'use strict';

angular.module('myApp.fd-main', ['ngRoute','restangular','ngSanitize','myApp.esrileafmap'])

.controller('FDMainController', 
		['$scope', '$http', '$filter', '$sce', '$modal', 'translationService', 'formatStrFactory','fdDetailsType', 'fdAuthorityType', 'fdActivityType',
		 'fdPollutantreleasesType', 'fdWastetransfersType', 'fdPollutanttransfersType', 
          function($scope, $http, $filter, $sce, $modal, translationService,formatStrFactory, fdDetailsType, fdAuthorityType, fdActivityType, 
        		  fdPollutantreleasesType, fdWastetransfersType, fdPollutanttransfersType) {

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
		$scope.tr_p = data.Pollutant;
		$scope.tr_w = data.WasteTransfers;
		$scope.tr_lna = data.LOV_NACEACTIVITY;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_lu = data.LOV_UNIT;
		$scope.tr_lcf = data.LOV_CONFIDENTIALITY;
		$scope.tr_lco = data.LOV_COUNTRY;
		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
		$scope.tr_lmbn = data.LOV_METHODBASIS;
		$scope.tr_lmtn = data.LOV_METHODTYPE;
		$scope.tr_lpo = data.LOV_POLLUTANT;
		$scope.tr_lwt = data.LOV_WASTETREATMENT;
		$scope.tr_lme = data.LOV_MEDIUM;
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
 * eventhandler for ReportingYear changed
 */
	$scope.updateWithNewYear = function(){
		$scope.resetcollections();
		$scope.year = $scope.selectedReportingYear.name;
		$scope.updateByFdidAndyear();
	}

        
/*
 * Tab handling
 * */
        
    $scope.active = {
		fddetails: true
	};
    $scope.activateTab = function(tab) {
    	  $scope.active = {}; //reset
    	  $scope.active[tab] = true;
    	}
        
/*
* Format lists
* */
	$scope.orderActivities = function(data){
		var a_list = [];
		var countAdditional = 0;
		for (var i=0; i<data.length; i++) {
			var a_itm = {};
			if(data[i].mainActivityIndicator){
				a_itm.content = $scope.tr_f.MainActivity;
				a_itm.ippcCode = '';
				a_itm.isSubHeaderRow = false;
				a_list.push(a_itm)
			}
			else if(countAdditional == 0){
				a_itm.content = $scope.tr_f.AdditionalActivities;
				a_itm.ippcCode = '';
				a_itm.isSubHeaderRow = false;
				countAdditional += 1;
				a_list.push(a_itm)
			}
			var a_itm = {};
			a_itm.content = $scope.tr_laa[data[i].iareportedActivityCode];
			a_itm.ippcCode = data[i].ippcreportedActivityCode;
			a_itm.isSubHeaderRow = true;
			a_list.push(a_itm)
		}
		return a_list;
	};

	$scope.orderReportingYears = function(data){
		var a_list = [];
		var cou = 0;
		for (var i=0; i<data.length; i++) {
			if(data[i].reportingYear){
				a_list.push({"name":data[i].reportingYear, "id":cou});
				cou += 1;
			}
		}
		return a_list;
	};
	

	/*
	 * Request data by FacilityReportID
	 * */
	$scope.updateByFdrid = function(){
		$scope.map = {wh : {'FacilityReportID': $scope.frid}};
		fdDetailsType.getByFdrID($scope.frid).get().then(function (fddata) {
			$scope.details = fddata;
			$scope.fid = fddata.facilityId;
			$scope.year = fddata.reportingYear;
			$scope.showalert = fddata.confidentialIndicator;
        });
		fdAuthorityType.get($scope.frid).get().then(function(data) {
			 $scope.authority = data;
		});
		fdActivityType.getList($scope.frid).then(function(data) {
			 $scope.activities = $scope.orderActivities(data);
		});
		fdPollutantreleasesType.getList($scope.frid).then(function(data) {
			 $scope.pollutantreleases = data;
			 if(!$scope.showalert && data.confidentialIndicator != undefined){
				 $scope.showalert = data.confidentialIndicator;
			 }
		});
		fdPollutanttransfersType.getList($scope.frid).then(function(data) {
			 $scope.pollutanttransfers = data;
			 if(!$scope.showalert && data.confidentialIndicator != undefined){
				 $scope.showalert = data.confidentialIndicator;
			 }
		});
		fdWastetransfersType.getList($scope.frid).then(function(data) {
			 $scope.wastetransfers = data;
			 if(!$scope.showalert && data.confidentialIndicator != undefined){
				 $scope.showalert = data.confidentialIndicator;
			 }
		});
	};

	/*
	 * Request data by FacilityID and ReportingYear
	 * */
	$scope.updateByFdidAndyear = function(){
		$scope.map = {wh : {'FacilityID': $scope.fid, 'ReportingYear': $scope.year}};
		fdDetailsType.getByFdIDAndYear($scope.fid,$scope.year).then(function (details) {
			$scope.details = details[0];
			$scope.frid = details[0].facilityReportID;
			 if(!$scope.showalert && details[0].confidentialIndicator != undefined){
				 $scope.showalert = details[0].confidentialIndicator;
			 }
			fdAuthorityType.get(details[0].facilityReportID).get().then(function(authority) {
				 $scope.authority = authority;
			});
			fdActivityType.getList(details[0].facilityReportID).then(function(activit) {
				 $scope.activities = $scope.orderActivities(activit);
			});
			fdPollutantreleasesType.getList(details[0].facilityReportID).then(function(data) {
				 $scope.pollutantreleases = data;
				 if(!$scope.showalert && data.confidentialIndicator != undefined){
					 $scope.showalert = data.confidentialIndicator;
				 }
			});
			fdPollutanttransfersType.getList(details[0].facilityReportID).then(function(data) {
				 $scope.pollutanttransfers = data;
				 if(!$scope.showalert && data.confidentialIndicator != undefined){
					 $scope.showalert = data.confidentialIndicator;
				 }
			});
			fdWastetransfersType.getList(details[0].facilityReportID).then(function(data) {
				 $scope.wastetransfers = data;
				 if(!$scope.showalert && data.confidentialIndicator != undefined){
					 $scope.showalert = data.confidentialIndicator;
				 }
			});
        });
	};
	
/*
 * Deciding which method to use requesting for data 
 * */	
	if ($scope.frid !== undefined && $scope.frid != null && $scope.frid != ''){
		$scope.updateByFdrid();
	}
	else if ($scope.fid != undefined && $scope.year != undefined && 
			 $scope.fid != null && $scope.year != null &&
			 $scope.fid != '' && $scope.year != ''){
		$scope.updateByFdidAndyear();
	}

/*
 * Watching scope parameters for changes
 * When asyncrone requests have replied we update the collections   
 * */

	//Watch the Reporting Year selector 
	$scope.$watchCollection('[fid, year]', function(value) {
 		if($scope.reportingYears == undefined &&
 			$scope.fid != undefined && $scope.fid != null 
			&& $scope.year != undefined && $scope.year != null){
			fdDetailsType.getByFdIDAndYear($scope.fid,null).then(function (data) {
				$scope.reportingYears = $scope.orderReportingYears(data);
				var indexes = $.map($scope.reportingYears, function(obj, index) {
				    if(obj.name == $scope.year) {
				        return index;
				    }
				});
				$scope.selectedReportingYear = $scope.reportingYears[indexes[0]];
			});
 		}
 	});
	
	//Watch results for FacilitydetailsDetail request and common resources
	$scope.$watchCollection('[tr_c,tr_f, details]', function(value) {
 		if ($scope.tr_c !== undefined && $scope.tr_f !== undefined && $scope.details !== undefined){
 			var adr = $scope.details.address != null?
 					$scope.details.address + ", " +  $scope.details.postalCode + ", " +  $scope.details.city:
 						null;
			$scope.headitms = [
	                  			{'order':0,	'clss':'fdTitles',
	                  				'title':$scope.tr_f.FacilityName,
	                  				'val': $scope.fFactory.ConfidentialFormat($scope.details.facilityName, $scope.details.confidentialIndicator)
	                  			},
	                  			{'order':1, 'clss':'fdTitles',
	                  				'title': $scope.tr_f.Address,
	                  				'val': $scope.fFactory.ConfidentialFormat(adr, $scope.details.confidentialIndicator)
	                  			},
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

	//Watch results for FacilitydetailsDetail request and country resources
 	$scope.$watchCollection('[tr_c, tr_lco, details]', function(value) {
		if($scope.details !== undefined && $scope.tr_c !== undefined 
				&& $scope.details.countryCode !== undefined && $scope.tr_lco !== undefined){
			$scope.headitms.push({'order':2,'clss':'fdTitles',
	                  				'title':$scope.tr_c.Country,
	                  				'val': $scope.tr_lco[$scope.details.countryCode]
	                  			});
		}
	});
	
	//Watch results for FacilitydetailsDetail request and nuts resources
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

	//Watch results for FacilitydetailsDetail request and river basin district resources
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

	//Watch results for FacilitydetailsDetail request and activity resources
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
	
	//Watch results for FacilitydetailsDetail request and production resources
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
	
	//Watch results for FacilitydetailsDetail request and confidential resources
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
	//Watch results for FacilitydetailsAuthority request
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
 	
 	/*
 	 * Handling Modal popup
 	 * */
 	    
 	    $scope.openActivity = function (size) {

 	        var modalInstance = $modal.open({
 	          templateUrl: 'myActivityContent.html',
 	          controller: 'ModalActivityInstanceCtrl',
 	          size: size,
 	          resolve: {
 	            input: function () {
 	              return $scope.tr_lib;
 	            }
 	          }
 	        });
 	    };

 	    $scope.openPollutant = function (size) {

 	        var modalInstance = $modal.open({
 	          templateUrl: 'myPollutantContent.html',
 	          controller: 'ModalPollutantInstanceCtrl',
 	          size: size,
 	          resolve: {
 	            items: function () {
 	              //return $scope.items;
 	            }
 	          }
 	        });
 	    };

    /**
     * TimeSeries Modal popup
     */
    $scope.openTSmodal = function (contentype, pollutantId, medium, wastetype) {
    	/*Convert item into Query params*/
    	var qp = {};
	    for(var key in $scope.queryParams) {
	        if(key != 'lov_PollutantID' && key != 'MediumCode' && key != 'wastetype') {
	        	qp[key] = $scope.queryParams[key];
	        }
	    }
    	
	    //'FacilityID': $scope.fid, 'ReportingYear': $scope.year
	    qp.FacilityID = $scope.fid;
	    qp.ReportingYear = $scope.year;
	    qp.FacilityReportID = $scope.frid;
    	if(pollutantId !== null){
    		qp.LOV_PollutantID = pollutantId;
    	}
    	if(medium !== null){
    		qp.MediumCode = medium;
    	}
      	if(wastetype !== null){
      		qp.WasteTypeCode = wastetype;
      	}
      	
    	var modalInstance = $modal.open({
          templateUrl: 'components/timeseries/tsmodal.html',
          controller: 'ModalTimeSeriesCtrl',
//          size: size,
          resolve: {
        	  isoContType: function () {
        		  return contentype;
        	  },
           	  isoQP: function () {
        		  return qp;
        	  }
     
          }
        });
    };

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

.factory('fdActivityType', ['fdActivityService', function(fdActivityService) {
    return {
        getList : function(fdrid) {
            return fdActivityService.getList({FacilityReportID:fdrid});
        }
    };
}])

.factory('fdPollutantreleasesType', ['fdPollutantreleasesService', function(fdPollutantreleasesService) {
    return {
        getList : function(fdrid) {
            return fdPollutantreleasesService.getList({FacilityReportID:fdrid});
        }
    };
}])

.factory('fdPollutanttransfersType', ['fdPollutanttransfersService', function(fdPollutanttransfersService) {
    return {
        getList : function(fdrid) {
            return fdPollutanttransfersService.getList({FacilityReportID:fdrid});
        }
    };
}])

.factory('fdWastetransfersType', ['fdWastetransfersService', function(fdWastetransfersService) {
    return {
        getList : function(fdrid) {
            return fdWastetransfersService.getList({FacilityReportID:fdrid});
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

.service('fdActivityService', ['Restangular', function(Restangular){
    var fdActivity = Restangular.service('facilitydetailActivity');

    Restangular.extendModel('facilitydetailActivity', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdActivity;
}])

.service('fdPollutantreleasesService', ['Restangular', function(Restangular){
    var fdPollutantrelease = Restangular.service('facilitydetailPollutantrelease');

    Restangular.extendModel('facilitydetailPollutantrelease', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdPollutantrelease;
}])

.service('fdPollutanttransfersService', ['Restangular', function(Restangular){
    var fdPollutanttransfer = Restangular.service('facilitydetailPollutanttransfer');

    Restangular.extendModel('facilitydetailPollutanttransfer', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdPollutanttransfer;
}])

.service('fdWastetransfersService', ['Restangular', function(Restangular){
    var fdWastetransfer = Restangular.service('facilitydetailWastetransfer');

    Restangular.extendModel('facilitydetailWastetransfer', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return fdWastetransfer;
}])

/*.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  })*/
  .controller('ModalPollutantInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

  .controller('ModalActivityInstanceCtrl', function ($scope, $modalInstance, input) {

  $scope.input = input;

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