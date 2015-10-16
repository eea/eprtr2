
'use strict';
// a directive to auto-collapse long text
// in elements with the "dd-text-collapse" attribute
//angular.module('myApp.textcollapse', [])
myApp.directive('prSelector', ['$compile','$http', '$filter', 'Restangular', 'eprtrcms', 
                               function($compile,$http, $filter, Restangular, eprtrcms) {

    return {
        restrict: 'A',
        scope: {
        	queryparams: '=?',
        	medium: '=',
        },
        replace: true,
        //transclude: true,
        link: function(scope, element, attrs) {

        	eprtrcms.get('Common',null).then(function (data) {
        		scope.tr_c = data;
        	});
        	eprtrcms.get('Pollutant',null).then(function (data) {
        		scope.tr_p = data;
        	});

    		scope.medfilter = {};

    		/*
    		 * scope.filter.prsel = scope.queryParams.MediumCode[0];
					if (scope.queryParams.MediumCode.length > 1){
						scope.reqPollutantReleaseRBHeader();
					}
    		 * */
            scope.$watch('queryparams', function(newValue, oldValue) {
                if (newValue)
                    console.log("I see a data change!");
        		if (scope.queryparams){
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
        	        pollutantSearchCounts.get(scope.queryparams).then(function(response) {
//        	            scope.headitems = response.data;
        	            scope.quantityAir = response.data.quantityAir;
        	            scope.quantityWater = response.data.quantityWater;
        	            scope.quantitySoil = response.data.quantitySoil;
        	            
        	            if(scope.queryparams.MediumCode != undefined){
        	            	scope.medfilter.prsel = scope.queryparams.MediumCode[0];
        	            }
        	            else{
        	            	scope.medfilter.prsel = 'AIR';
        	            }
        	        });
        		}
            }, true);
            
            scope.$watch('medfilter.prsel', function(newvalue,oldvalue){
            	if(scope.medfilter.prsel != undefined){
            		scope.medium = scope.medfilter.prsel;
            	}
            });
            
            /*scope.$watch('queryparams', function(value){
        		if (scope.queryparams){
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
        	        pollutantSearchCounts.get(scope.queryparams).then(function(response) {
//        	            scope.headitems = response.data;
        	            scope.quantityAir = response.data.quantityAir;
        	            scope.quantityWater = response.data.quantityWater;
        	            scope.quantitySoil = response.data.quantitySoil;
        	            
        	            if(scope.queryparams.MediumCode != undefined){
        	            	scope.medfilter.prsel = scope.queryparams.MediumCode[0];
        	            }
        	            else{
        	            	scope.medfilter.prsel = 'AIR';
        	            }
        	        });
        		}
            });*/
            
    		scope.$watchCollection('[quantityAir,quantityWater,quantitySoil,tr_c,tr_p]', function(value) {
    			
                if (scope.quantityAir != undefined && scope.tr_p != undefined ) {

                    // create some new html elements to hold the separate info
                    var title = $compile('<label class="control-label"><strong>'+scope.tr_p.ShowFacilitiesReleasingToMedium+':</strong></label></br>')(scope); 
                    
                    var body = '<label class="radio-inline" for="AIR"><input type="radio" id="AIR" name="prsel" ng-model="medfilter.prsel" value="AIR" /> ';
                    body += scope.tr_c.Air + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityAir);
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityAir) + '</span></label>';
                    //var hNONHW = $compile(sNONHW)(scope);
                    
                    body += '<label class="radio-inline" for="WATER"><input type="radio" id="WATER" name="prsel" ng-model="medfilter.prsel" value="WATER" /> ';
                    body += scope.tr_c.Water + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityWater); 
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityWater) +  '</span></label>';
 //                   sWATER += scope.tr_c.HazardouswasteWithinCountry + '</BR> (' + $filter('number')(scope.quantityWater) + ' ' + scope.tr_c.Facilities + ') </label>';
                    //var hWATER = $compile(sWATER)(scope);

                    body += '<label class="radio-inline"  for="SOIL"><input type="radio" id="SOIL" name="prsel" ng-model="medfilter.prsel" value="SOIL" /> ';
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
