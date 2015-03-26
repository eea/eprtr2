'use strict';

angular.module('myApp.timeseries', ['ngRoute','restangular','ngSanitize'])

.controller('TimeseriesController', 
		['$scope', '$http', '$filter', 'Restangular', 'translationService', 'lovPollutantType','lovCountryType', 
		 'lovAreaGroupType', 'lovNutsRegionType', 'riverBasinDistrictsType', 'annexIActivityType', 'naceActivityType', 
          function($scope, $http, $filter, Restangular, translationService, lovPollutantType, lovCountryType, 
        		  lovAreaGroupType, lovNutsRegionType, riverBasinDistrictsType, annexIActivityType, naceActivityType ) {

/**		
 * Basic parameters
 * */
	$scope.ConfidentialityExplanation = '';
	$scope.headitms = [];
	$scope.showalert = false;
	$scope.showGroup = false;
	$scope.base = {};
	$scope.filter = {}
	//DATA
	$scope.tscoll = [];
	
	$scope.prselcoll = [];
	$scope.wtselcoll = []; //NONHW, HWIC, HWOC
	
	$scope.prconfcoll = [];
	$scope.ptconfcoll = [];
	$scope.wtconfcoll = [];

/*
 * Load translation resources 
 * */        
//		Requesting text and title resources 
	translationService.get().then(function (data) {
		$scope.tr_f = data.Facility;
		$scope.tr_c = data.Common;
		$scope.tr_t = data.Timeseries;
		$scope.tr_p = data.Pollutant;
		$scope.tr_w = data.WasteTransfers;
		$scope.tr_lcf = data.LOV_CONFIDENTIALITY;
		$scope.tr_lag = data.LOV_AREAGROUP;
		$scope.tr_lnr = data.LOV_NUTSREGION;
		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
		$scope.tr_lco = data.LOV_COUNTRY;
		$scope.tr_la = data.Activity;
		$scope.tr_lna = data.LOV_NACEACTIVITY;
		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
		$scope.tr_lp = data.LOV_POLLUTANT;
		$scope.tr_lm = data.LOV_MEDIUM;
		$scope.tr_lwt = data.LOV_WASTETYPE;
		
    });

		/**
		 * events
		 */
        $scope.$watch('prselcoll', function(value) {
			$scope.reqPollutantReleaseData();
			//Pollutantrelease medium changed
            /*if ($scope.items) {
                $scope.updateSummaryData();
            }*/
        });

        $scope.$watch('wtselcoll', function(value) {
        	//Wastetransfer hazard type changed
            /*if ($scope.items) {
                $scope.updateSummaryData();
            }*/
        });

	$scope.$watchCollection('[queryParams,tr_c]', function(value) {
		if($scope.tr_c != undefined && $scope.queryParams != undefined  && $scope.queryParams != ""){
			$scope.createheader();
		}
	});
        
	$scope.$watchCollection('[content,tr_c]', function(value) {
		if($scope.tr_c != undefined){
	        /**
	         * Set prtr scope
	         */
			switch($scope.content){
				case 'pollutantrelease': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantReleases;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPR1;
					$scope.prselcoll.prsel ="air";
					//Request data
					$scope.reqPollutantReleaseData();
					break;
				case 'pollutanttransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPT1;
					//$scope.filter.prsel ="air";
					//Request data
					break;
				case 'wastetransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.WasteTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationWT1;
					$scope.wtselcoll.wtsel = 'nonhw';
					//Request data
					break;
			}
		}
	});
		
		/*HEADER*/
	$scope.createheader = function(){
		$scope.headitms = [];
		//Area
		var area = {'order':0,	'clss':'fdTitles', 'title':$scope.tr_c.Area};
		if($scope.queryParams.LOV_AreaGroupID != undefined){
			// Get list of Countries using AreaGroup ID
			lovAreaGroupType.getByID($scope.queryParams.LOV_AreaGroupID).get().then(function(data) {
				area.val = $scope.tr_lag[data.code];
				$scope.headitms.push(area);
			});
		}
		else if($scope.queryParams.LOV_CountryID != undefined){
			//We use LOV_NUTSRegionID for title
			if($scope.queryParams.LOV_NUTSRegionID != undefined){
				lovNutsRegionType.getByID($scope.queryParams.LOV_NUTSRegionID).get().then(function(data) {
					area.val = $scope.tr_lnr[data.code];
					$scope.headitms.push(area);
				});
			}
			//We use LOV_RiverBasinDistrictID for title
			else if($scope.queryParams.LOV_RiverBasinDistrictID != undefined){
				riverBasinDistrictsType.getByID($scope.queryParams.LOV_RiverBasinDistrictID).get().then(function(data) {
					area.val = $scope.tr_lrbd[data.code];
					$scope.headitms.push(area);
				});
			}
			//We use LOV_CountryID for title
			else{
				lovCountryType.getByID($scope.queryParams.LOV_CountryID).get().then(function(data) {
					area.val = $scope.tr_lco[data.countryCode];
					$scope.headitms.push(area);
				});
			}
		}
		//Industrial Activity
		var act = {'order':1, 'clss':'fdTitles'};
		act.val = $scope.tr_c["AllSectors"];
        if ($scope.queryParams.LOV_NACESubActivityID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACESubActivityID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_NACEActivityID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACEActivityID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_NACESectorID != undefined) {
            act.title = $scope.tr_la['NACE'];
            naceActivityType.getByID($scope.queryParams.LOV_NACESectorID).get().then(function(data) {
        		act.val = $scope.tr_lna[data.code];
				$scope.headitms.push(act);
			});
        }
        else if ($scope.queryParams.LOV_AISubActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AISubActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_AIActivityID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AIActivityID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        } else if ($scope.queryParams.LOV_AISectorID != undefined) {
			act.title = $scope.tr_la['AnnexI'];
        	annexIActivityType.getByID($scope.queryParams.LOV_AISectorID).get().then(function(data) {
        		act.val = $scope.tr_laa[data.code];
				$scope.headitms.push(act);
			});
        }

		//Pollutant
	    if ($scope.content == 'pollutantrelease' || $scope.content == 'pollutanttransfer'){
			var pol = {'order':2, 'clss':'fdTitles'};
			pol.title = $scope.tr_c["Pollutant"];
			pol.val = $scope.tr_c["AllPollutants"];
			if ($scope.queryParams.LOV_PollutantGroupID)
	        {
				lovPollutantType.getByID($scope.queryParams.LOV_PollutantGroupID).get().then(function(data) {
					// returns pollutant object 
					$scope.base.pollutant = data;
					pol.val = $scope.tr_lp[data.code];
					$scope.headitms.push(pol);
				});
	        }
	        else if ($scope.queryParams.LOV_PollutantID)
	        {
				lovPollutantType.getByID($scope.queryParams.LOV_PollutantID).get().then(function(data) {
					// returns pollutant object 
					$scope.base.pollutant = data;
					pol.val = $scope.tr_lp[data.code];
					$scope.headitms.push(pol);
					if(data.parentID != null){
						// We use the pollutant.ParentID.Value for requesting parent pollutant
						// We use the parent pollutant.Code for $scope.base.parentCode
						$scope.showGroup = true;
						lovPollutantType.getByID(data.parentID).get().then(function(parentdata) {
							$scope.base.parentpollutant = parentdata;
						});
					}
				});
	        }
			//Releases to
		    if ($scope.queryParams.MediumCode != undefined){
				var rel = {'order':3, 'clss':'fdTitles'};
				rel.title = $scope.tr_c["ReleasesTo"];
				rel.val = $scope.tr_c["AllPollutants"];
				var med = [];
				for (var i=0; i< $scope.queryParams.MediumCode.length; i++) {
					var m = $scope.queryParams.MediumCode[i];
		    		if (m != 'WASTEWATER'){
		    			med.push($scope.tr_lm[m]);
		    		}
		    	}
		    	if (med.length > 0){
			    	rel.val = med.join(", ");
					$scope.headitms.push(rel);
		    	}
				if($scope.queryParams.MediumCode.indexOf('WASTEWATER') >-1){
					rel = {'order':4, 'clss':'fdTitles'};
					rel.title = $scope.tr_c["TransfersTo"];
					rel.val = $scope.tr_lm["WASTEWATER"];
					$scope.headitms.push(rel);
				}
		    }
		  //Accidental
		    if ($scope.queryParams.Accidental != undefined && $scope.queryParams.Accidental == 1){
				var acc = {'order':5, 'clss':'fdTitles'};
				acc.title = $scope.tr_c["AccidentalOnly"];
				acc.val = $scope.tr_c["Yes"];
				$scope.headitms.push(acc);
		    }
	    }
	    else if ($scope.content == 'wastetransfer'){
			//Waste type
		    if ($scope.queryParams.WasteTypeCode != undefined){
				var wast = {'order':6, 'clss':'fdTitles'};
				wast.title = $scope.tr_c["WasteTransfers"];
				var wt = [];
				for (var i=0; i< $scope.queryParams.WasteTypeCode.length; i++) {
					var w = $scope.queryParams.WasteTypeCode[i];
		    		if (w != 'HW'){
		    			wt.push($scope.tr_lwt[w]);
		    		}
		    	}
		    	if (wt.length > 0){
		    		wast.val = wt.join(", ");
					$scope.headitms.push(wast);
		    	}
		    }
	    }
	};
		
		/**
		 * Data 
		 * */

	
	//Pollutantrelease
	$scope.reqPollutantReleaseData = function(){
		if ($scope.queryParams.length > 0){
			//PollutantReleaseTrend.GetTimeSeries(filter, medium); 
			//Request data then group
	        var rest = Restangular.withConfig(function(RestangularConfigurer) {
	            RestangularConfigurer.setFullResponse(true);
	        });
	        var pollutantSearch = rest.all('pollutantreleaseSearch');
	        pollutantSearch.getList($scope.queryParams).then(function(response) {
	            $scope.items = response.data;
	
	            $scope.quantityAir = response.headers('X-QuantityAir');
	            $scope.quantityWater = response.headers('X-QuantityWater');
	            $scope.quantitySoil = response.headers('X-QuantitySoil');
	
	        });
		}
		
	};
	
	
		//GetTimeSeries(PollutantReleasesTimeSeriesFilter filter, MediumFilter.Medium medium) -->
		//	GetTimeSeries([AreaFilter,PeriodFilter,PollutantFilter,MediumFilter,ActivityFilter], MediumFilter.Medium medium)
		//GetTimeSeries(int facilityid, string pollutantCode, MediumFilter.Medium medium)
		/*
			db.POLLUTANTRELEASEs.Where(lambda).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key);
			or  
			db.POLLUTANTRELEASEs.Where(f => f.FacilityID == facilityid && f.PollutantCode == pollutantCode).Where(getLambdaExpression(medium)).GroupBy(p => p.ReportingYear);
           switch (medium)
            {
                case MediumFilter.Medium.Air:
                    data = group.Select(x => new TimeSeriesClasses.PollutantReleases(x.Key,x.Count(), x.Sum(p => p.QuantityAir),x.Sum(p => p.QuantityAccidentalAir)));
                    break;
                case MediumFilter.Medium.Soil:
                    data = group.Select(x => new TimeSeriesClasses.PollutantReleases(x.Key, x.Count(), x.Sum(p => p.QuantitySoil), x.Sum(p => p.QuantityAccidentalSoil)));
                    break;
                case MediumFilter.Medium.Water:
                    data = group.Select(x => new TimeSeriesClasses.PollutantReleases(x.Key, x.Count(), x.Sum(p => p.QuantityWater), x.Sum(p => p.QuantityAccidentalWater)));
                    break;
                default:
                    throw new ArgumentOutOfRangeException("medium", String.Format("Illegal medium: {0}", medium.ToString()));
            }
            Facility.GetReportingCountries(filter.AreaFilter).ToList(); and clone with collection
            return res.OrderBy(p => p.Year).ToList();
		 *
		 */		
		
		//Pollutanttransfer
		//GetTimeSeries([AreaFilter,PeriodFilter,PollutantFilter,ActivityFilter])
		/*
		 db.POLLUTANTTRANSFERs.Where(lambda).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key).Select(x => new {
                                                Year = x.Key, 
                                                Quantity = x.Sum(p => p.Quantity), 
                                                Facilities = x.Count()}).ToList();
         Facility.GetReportingCountries(filter.AreaFilter).ToList(); and then clone   
         return res.OrderBy(p => p.Year).ToList();                                   
		 */
		//GetTimeSeries(int facilityid, string pollutantCode)
		/*
		db.POLLUTANTTRANSFERs.Where(f => f.FacilityID == facilityid && f.PollutantCode == pollutantCode).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key)
                 .Select(x => new TimeSeriesClasses.PollutantTransfers(x.Key, x.Sum(p => p.Quantity)));
        return data.ToList();
		 */
		
		
		//WasteTransfer
		//GetTimeSeries(WasteTransferTimeSeriesFilter filter, WasteTypeFilter.Type wastetype) -->
		//  GetTimeSeries([AreaFilter,PeriodFilter,ActivityFilter,WasteTypeFilter,WasteTreatmentFilter], WasteTypeFilter.Type wastetype)
		/*
           db.WASTETRANSFERs.Where(lambda).GroupBy(p => p.ReportingYear).OrderBy(p => p.Key);
           switch (wastetype)
            {
                case HazardousCountry:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.HazardousCountry, x.Sum(p => p.QuantityTotalHWIC), x.Sum(p => p.QuantityRecoveryHWIC), x.Sum(p => p.QuantityDisposalHWIC), x.Sum(p => p.QuantityUnspecHWIC)));
                case HazardousTransboundary:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.HazardousTransboundary, x.Sum(p => p.QuantityTotalHWOC), x.Sum(p => p.QuantityRecoveryHWOC), x.Sum(p => p.QuantityDisposalHWOC), x.Sum(p => p.QuantityUnspecHWOC)));
                case NonHazardous:
                    data = group.Select(x => new TimeSeriesClasses.WasteTransfer(x.Key, x.Count(), WasteTypeFilter.Type.NonHazardous, x.Sum(p => p.QuantityTotalNONHW), x.Sum(p => p.QuantityRecoveryNONHW), x.Sum(p => p.QuantityDisposalNONHW), x.Sum(p => p.QuantityUnspecNONHW)));
                default:
                    throw new ArgumentOutOfRangeException("wastetype", String.Format("Illegal wastetype: {0}", wastetype.ToString()));
            }
            then add no of reporting countries
            Facility.GetReportingCountries(filter.AreaFilter).ToList();
			l.Year, l.Facilities, l.WasteType, l.QuantityTotal, l.QuantityRecovery, l.QuantityDisposal, l.QuantityUnspec, r.Countries
		 * */
		

		
		
/** 
 * CONFIDENTIALITY
 * */		
		
		/*P*/
		/*We need to group the returned data by year:
		 .GroupBy(p => p.ReportingYear)
		 We order by pollutant
         .OrderBy(p => p.Key)
         
                                            .Select(x => new {
                                                Year = x.Key, 
                                                Quantity = x.Sum(p => p.Quantity), 
                                                Facilities = x.Count()}).ToList();
		 * */
	   /*    this.Year = year;
           this.QuantityPollutant = quantityPollutant;
           this.QuantityConfidential = quantityConfidential;
           this.UnitPollutant = CODE_KG;
           this.UnitConfidential = CODE_KG;*/
		
}])



/*
 * Factories
 * */
.factory('lovPollutantType', ['lovPollutantService', function(lovPollutantService) {
        return {
        	getByID : function(id) {
                return lovPollutantService.one(id);
            }
        };
    }])

.factory('lovCountryType', ['lovCountryService', function(lovCountryService) {
        return {
        	getByID : function(id) {
                return lovCountryService.one(id);
            }
        };
    }])

.factory('lovAreaGroupType', ['lovAreaGroupService', function(lovAreaGroupService) {
    return {
    	getByID : function(id) {
            return lovAreaGroupService.one(id);
        }
    };
}])

.factory('lovNutsRegionType', ['lovNutsRegionService', function(lovNutsRegionService) {
    return {
    	getByID : function(id) {
            return lovNutsRegionService.one(id);
        }
    };
}])

.factory('riverBasinDistrictsType', ['riverBasinDistrictsService', function(riverBasinDistrictsService) {
    return {
    	getByID : function(id) {
            return riverBasinDistrictsService.one(id);
        }
    };
}])

    
    
/*
 * SERVICES
 * **/

.service('lovPollutantService', ['Restangular', function(Restangular){
    var lovPollutant = Restangular.service('pollutant');

    Restangular.extendModel('pollutant', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovPollutant;
}])

.service('lovCountryService', ['Restangular', function(Restangular){
    var lovCountry = Restangular.service('lovCountry');

    Restangular.extendModel('lovCountry', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovCountry;
}])

.service('lovAreaGroupService', ['Restangular', function(Restangular){
    var lovAreaGroup = Restangular.service('lovAreaGroup');

    Restangular.extendModel('lovAreaGroup', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovAreaGroup;
}])

.service('lovNutsRegionService', ['Restangular', function(Restangular){
    var lovNutsRegion = Restangular.service('nutsRegion');

    Restangular.extendModel('nutsRegion', function(model) {
        model.getDisplayText = function() {
            return this.code + ' ' + this.name;
        };
        return model;
    });

    return lovNutsRegion;
}])

.service('riverBasinDistrictsService', ['Restangular', function(Restangular){
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
 *  
 * You can use only one of these parameters: 
 * */
.directive('timeseries', function() {
	return {
		restrict: 'E',
		controller: 'TimeseriesController',
        transclude: true,
		scope: {
			content: '@', /*[pollutantrelease,pollutanttransfer,wastetransfer]*/
			queryParams: '=queryParams', /* Filter needs to include area, activity, [pollutant, medium, wastetype ]/  */
			year: '@'
		},
		templateUrl: 'components/timeseries/timeseries.html',
		link: function(scope, element, attrs){
/*			scope.$watchCollection('[frid, fid, year]', function() {
				console.log('FacilityReportID changed:' + scope.frid);
	        	//scope.setwhere(scope.buildWhere(scope.queryparams));
		    },true);*/
		}
	};
});
