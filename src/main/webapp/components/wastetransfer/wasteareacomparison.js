'use strict';

angular.module('myApp.wasteAreaComparison', ['restangular','ngSanitize'])

   .controller('WasteAreaComparisonCtrl', ['$scope', '$filter', 'Restangular',
                                       'translationService','formatStrFactory', function($scope, $filter,  
                                    		   Restangular,translationService,formatStrFactory) {
        $scope.ff = formatStrFactory;
        //$scope.queryParams = {};
        $scope.translate = function()
        {
        	translationService.get().then(function (data) {
        		$scope.tr_lco = data.LOV_COUNTRY;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_f = data.Facility;
        		$scope.tr_c = data.Common;
        		$scope.tr_p = data.Pollutant;
        		$scope.tr_laa = data.LOV_ANNEXIACTIVITY;
        		$scope.tr_lcon =data.LOV_CONFIDENTIALITY;
        		$scope.tr_con =data.Confidentiality;
        		$scope.tr_lpo = data.LOV_POLLUTANT;
        		$scope.tr_lnr = data.LOV_NUTSREGION;
        		$scope.tr_lrbd = data.LOV_RIVERBASINDISTRICT;
        		$scope.tr_wt = data.WasteTransfers;
        		$scope.tr_lovwt = data.LOV_WASTETYPE;
        	  });
        };
        $scope.translate();
        
        $scope.$watchCollection('[tr_lovwt,queryparams]', function(value){
        	if($scope.queryparams != undefined && $scope.tr_lovwt != undefined && $scope.confidential ){
                /*$scope.wtconfcoll = [];
                $scope.wtconfreasoncoll = [];
        		$scope.reqAllfData();
        		$scope.reqConfData();
        		$scope.reqReasonData();*/
        	}
        });
        
        $scope.updateAreaComparisonData = function() {
        	var qmstr = 'quantity' + $scope.mediumTypeSummary;
        	$scope.areaComparisonItems = $filter('filter')($scope.items, function (item) {
                if (item['quantity' + $scope.mediumTypeAreaComparison]) {
                    return true;
                }
                return false;
            });
            
            var totalquantity = 0;
            var graphData = {};
            for (var i = 0; i < $scope.areaComparisonItems.length; i++) {
                // Test for creating country
            	if (!graphData[$scope.areaComparisonItems[i].countryCode]) {
            		
            		//$scope.tr_chart.AREA
                    graphData[$scope.areaComparisonItems[i].countryCode] = 
                    {c: [
                        {v: $scope.areaComparisonItems[i].countryCode},
                        {v: $scope.areaComparisonItems[i][qmstr]},
                        {v: "ff<br/>Dette er en test"} 
                    ]};
                    totalquantity +=$scope.areaComparisonItems[i][qmstr];
                } else {
                    graphData[$scope.areaComparisonItems[i].countryCode].c[1].v =
                        graphData[$scope.areaComparisonItems[i].countryCode].c[1].v + $scope.areaComparisonItems[i][qmstr];
                    graphData[$scope.areaComparisonItems[i].countryCode].c[2].v = "ff<br /> test";
                    totalquantity +=$scope.areaComparisonItems[i][qmstr];
                }
            }

            var graphDataArray = [];
            for (var key in graphData) {
                if (graphData.hasOwnProperty(key)) {
                	// Calculate % of total quantity
                	graphData[key].c[1].v =  Math.round(((graphData[key].c[1].v * 100) / totalquantity)*100)/100;
                    graphDataArray = graphDataArray.concat(graphData[key]);
                }
            }
            graphDataArray = _.sortBy(graphDataArray, function(element) {  return element.c[1].v;}).reverse();
        	
            // $scope.tr_chart.PERCENT_TOTAL;
            $scope.areaComparisonChartObject = {};
            $scope.areaComparisonChartObject.data = {
                "cols": [
                    {id: "t", label: "Name", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ],
                "rows": graphDataArray
            };
            $scope.areaComparisonChartObject.options = {"tooltip": {"isHtml": false}};
            $scope.areaComparisonChartObject.type = 'BarChart';
        };
        
        
   }])

 .directive('wasteAreaComparison', function() {
	return {
		restrict: 'E',
		controller: 'WasteAreaComparisonCtrl',
        transclude: true,
		scope: {
			queryparams: '=' 
		},
		templateUrl: 'components/wastetransfer/wasteareacomparison.html',
		link: function(scope, element, attrs){
		}
	};
});
        
