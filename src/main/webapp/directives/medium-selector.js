
'use strict';
// a directive to auto-collapse long text
// in elements with the "dd-text-collapse" attribute
//angular.module('myApp.textcollapse', [])
myApp.directive('prSelector', ['$compile','$http', '$filter', 'Restangular', 'translationService', 
                               function($compile,$http, $filter, Restangular, translationService) {

    return {
        restrict: 'A',
        scope: {
        	queryparams: '=',
        	prsel: '=',
        },
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {

    		translationService.get().then(function (data) {
    			scope.tr_c = data.Common;
    			scope.tr_lpo = data.LOV_POLLUTANT;
    	    });
    		scope.filter = {};

    		/*
    		 * $scope.filter.prsel = $scope.queryParams.MediumCode[0];
					if ($scope.queryParams.MediumCode.length > 1){
						$scope.reqPollutantReleaseRBHeader();
					}
    		 * */
    		
            scope.$watch('filter.prsel', function(value){
            	if(scope.filter.prsel != undefined){
            		scope.prsel = scope.filter.prsel;
            	}
            });
            
            scope.$watch('queryparams', function(value){
        		if (scope.queryparams != undefined){
        			//We don't want WasteTypeCode in query
        			var qp = {};
        		    for(var key in scope.queryparams) {
        		        if(key != 'MediumCode') {
        		        	qp[key] = scope.queryparams[key];
        		        }
        		    }
        		    
        			var rest = Restangular.withConfig(function(RestangularConfigurer) {
        	            RestangularConfigurer.setFullResponse(true);
        	        });
        	        var pollutantSearchCounts = rest.one('pollutantreleasecounts');
        	        pollutantSearchCounts.get($scope.queryParams).then(function(response) {
//        	            $scope.headitems = response.data;
        	            $scope.quantityAir = response.data.quantityAir;
        	            $scope.quantityWater = response.data.quantityWater;
        	            $scope.quantitySoil = response.data.quantitySoil;
        	            
        	            if(scope.queryparams.MediumCode != undefined){
        	            	scope.filter.prsel = scope.queryParams.MediumCode[0];
        	            }
        	        });
        		}
            });
            
    		scope.$watchCollection('[quantityAir,quantityWater,quantitySoil,tr_c,tr_lpo]', function(value) {
    			
                if (scope.quantityAir != undefined && scope.tr_c != undefined ) {

                    // create some new html elements to hold the separate info
                    var title = $compile('<label class="control-label"><strong>'+scope.tr_c.ShowFacilitiesReleasingToMedium+':</strong></label></br>')(scope); 
                    
                    var body = '<label class="radio-inline tab" for="AIR"><input type="radio" id="AIR" name="prsel" ng-model="filter.prsel" value="AIR" /> ';
                    body += scope.tr_c.Air + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityAir);
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityAir) + '</span></label>';
                    //var hNONHW = $compile(sNONHW)(scope);
                    
                    body += '<label class="radio-inline" for="WATER"><input type="radio" id="WATER" name="prsel" ng-model="filter.prsel" value="WATER" /> ';
                    body += scope.tr_c.Water + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityWater); 
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityWater) +  '</span></label>';
 //                   sWATER += scope.tr_c.HazardouswasteWithinCountry + '</BR> (' + $filter('number')(scope.quantityWater) + ' ' + scope.tr_c.Facilities + ') </label>';
                    //var hWATER = $compile(sWATER)(scope);

                    body += '<label class="radio-inline"  for="SOIL"><input type="radio" id="SOIL" name="prsel" ng-model="filter.prsel" value="SOIL" /> ';
                    body += scope.tr_c.Soil + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantitySoil);
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantitySoil) +  '</span></label>';
                    var hbody = $compile(body)(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(title);
                    element.append(hbody);
                }
                else {
                    element.empty();
                    //element.append(text);
                }
    		
    		});

    	}
    };
}]);
