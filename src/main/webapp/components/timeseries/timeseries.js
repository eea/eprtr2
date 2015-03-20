'use strict';

angular.module('myApp.timeseries', ['ngRoute','restangular','ngSanitize'])

.controller('TimeseriesController', 
		['$scope', '$http', '$filter', 'translationService', 'lovPollutantType',
          function($scope, $http, $filter, translationService, lovPollutantType ) {

/**		
 * Basic parameters
 * */
	$scope.ConfidentialityExplanation = '';
	$scope.headitms = [];
	$scope.showalert = false;
	$scope.showGroup = false;
	$scope.base = {};
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
    });

	$scope.$watch('queryParams', function(value) {
		if($scope.queryParams != undefined){
			/**
			 * We use pollutants for Pollutanttransfer and Pollutantrelease  
			 * */
			if($scope.queryParams.pollutantSearchFilter.PollutantID !== undefined){
				/*Request LOV_pollutant*/
				lovPollutantType.getById($scope.queryParams.pollutantSearchFilter.PollutantID).then(function(data) {
					// returns pollutant object 
					$scope.base.pollutant = data;
					if(data.parentID != null){
						// We use the pollutant.ParentID.Value for requesting parent pollutant
						// We use the parent pollutant.Code for $scope.base.parentCode
						$scope.showGroup = true;
						lovPollutantType.getByID(data.parentID).then(function(parentdata) {
							$scope.base.parentpollutant = parentdata;
						});
					}
				});
			}
			
		} 
	});


		/**
		 * events
		 */
        $scope.$watch('prsel', function(value) {
        	//Pollutantrelease medium changed
            /*if ($scope.items) {
                $scope.updateSummaryData();
            }*/
        });

        $scope.$watch('wtsel', function(value) {
        	//Wastetransfer hazard type changed
            /*if ($scope.items) {
                $scope.updateSummaryData();
            }*/
        });

	$scope.$watchCollection('[prtr,tr_c]', function(value) {
		if($scope.tr_c != undefined){
	        /**
	         * Set prtr scope
	         */
			switch($scope.prtr){
				case 'pollutantrelease': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantReleases;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPR1;
					//Request data
					break;
				case 'pollutanttransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.PollutantTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationPT1;
					//Request data
					break;
				case 'wastetransfer': 
					$scope.title = 'Time Series - ' + $scope.tr_c.WasteTransfers;
					$scope.ConfidentialityExplanation = $scope.tr_t.ConfidentialityExplanationWT1;
					$scope.wtsel = 'nonhw';
					//Request data
					break;
			}
		}
	});
		
		/*HEADER*/
		
/*		$scope.headitms = [
                 			{'order':0,	'clss':'fdTitles',
                 				'title':$scope.tr_f.FacilityName,
                 				'val': $scope.ConfidentialFormat($scope.details.facilityName, $scope.details.confidentialIndicator)
                 			}]*/
		/*Pollutant release*/
        /*addArea(header, filter.AreaFilter); addActivity(header, filter.ActivityFilter); addPollutant(header, filter.PollutantFilter); addMedium(header, filter.MediumFilter);*/
		/*Pollutant transfer*/
        /*addArea(header, filter.AreaFilter); addActivity(header, filter.ActivityFilter); addPollutant(header, filter.PollutantFilter);*/
		/*Waste transfer*/
        /*addArea(header, filter.AreaFilter); addActivity(header, filter.ActivityFilter); addWasteType(header, filter.WasteTypeFilter);*/

		
		
		
		/**
		 * Data 
		 * */
		//Pollutantrelease
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
            getById : function(id) {
                return lovPollutantService.one(id);
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
			prtr: '@', /*[pollutantrelease,pollutanttransfer,wastetransfer]*/
			queryParams: '=', /* Filter needs to include area, activity, [pollutant, medium, wastetype ]/  */
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
