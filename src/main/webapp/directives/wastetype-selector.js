
'use strict';
// a directive to auto-collapse long text
// in elements with the "dd-text-collapse" attribute
//angular.module('myApp.textcollapse', [])
myApp.directive('wtSelector', ['$compile','$http', '$filter', 'Restangular', 'translationService', 
                               function($compile,$http, $filter, Restangular, translationService) {

    return {
        restrict: 'A',
        scope: {
        	qparams: '=queryparams',
        	wtsel: '=',
        },
        replace: true,
        /*transclude: true,*/
        link: function(scope, element, attrs) {

    		translationService.get().then(function (data) {
    			scope.tr_c = data.Common;
    			scope.tr_w = data.WasteTransfers;
    	    });
    		/*scope.filter = {};
            scope.$watch('filter.wtsel', function(value){
            	if(scope.filter.wtsel != undefined){
            		scope.wtsel = scope.filter.wtsel;
            	}
            });*/
            
            scope.$watch('qparams', function(value){
        		if (scope.qparams != undefined){
        			//We don't want WasteTypeCode in query
        			var qp = {};
        		    for(var key in scope.qparams) {
        		        if(key != 'WasteTypeCode') {
        		        	qp[key] = scope.qparams[key];
        		        }
        		    }

        			//var qp = JSON.parse(attrs.wtSelectorQueryParams);
        			var rest = Restangular.withConfig(function(RestangularConfigurer) {
        	            RestangularConfigurer.setFullResponse(true);
        	        });
        	        var wastetransferSearchCounts = rest.one('wastetransferCounts');
        	        
        	        wastetransferSearchCounts.get(qp).then(function(response) {
//        	            $scope.headitems = response.data;
        	            scope.quantityNONHW = response.data.quantityNONHW;
        	            scope.quantityHWIC = response.data.quantityHWIC;
        	            scope.quantityHWOC = response.data.quantityHWOC;
        	            if(scope.qparams.WasteTypeCode != undefined){
            	            scope.wtsel = scope.qparams.WasteTypeCode[0];//'NONHW';
        	            }
        	            else{
        	            	scope.wtsel = 'NONHW';
        	            }
        	        });
        		}
            });
            
    		scope.$watchCollection('[quantityNONHW,quantityHWIC,quantityHWOC,tr_c,tr_w]', function(value) {
    			
                if (scope.quantityNONHW != undefined && scope.tr_c != undefined ) {

                    // create some new html elements to hold the separate info
                    var title = $compile('<label class="control-label"><strong>'+scope.tr_w.ShowFacilitiesWithTransferOfWasteType+':</strong></label></br>')(scope); 
                    
                    var body = '<label class="radio-inline" for="NONHW"><input type="radio" id="NONHW"  ng-model="wtsel" value="NONHW" /> ';
                    body += scope.tr_c.NoHazardouswaste + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityNONHW);
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityNONHW) + '</span></label>';
                    //var hNONHW = $compile(sNONHW)(scope);
                    
                    body += '<label class="radio-inline" for="HWIC"><input type="radio" id="HWIC" ng-model="wtsel" value="HWIC" /> ';
                    body += scope.tr_c.HazardouswasteWithinCountry + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityHWIC); 
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityHWIC) +  '</span></label>';
 //                   sHWIC += scope.tr_c.HazardouswasteWithinCountry + '</BR> (' + $filter('number')(scope.quantityHWIC) + ' ' + scope.tr_c.Facilities + ') </label>';
                    //var hHWIC = $compile(sHWIC)(scope);

                    body += '<label class="radio-inline"  for="HWOC"><input type="radio" id="HWOC" ng-model="wtsel" value="HWOC" /> ';
                    body += scope.tr_c.HazardouswasteTransboundary + ' <span class="label label-success label-as-badge" title="'+ $filter('number')(scope.quantityHWOC);
                    body += ' ' + scope.tr_c.Facilities+'">' + $filter('number')(scope.quantityHWOC) +  '</span></label>';
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
/*
 * 
 *    <div class="row" style="padding-top:10px;" ng-if="showwastetype">
        	<div class="col-md-12"><strong>{{tr_w.ShowFacilitiesWithTransferOfWasteType}}</strong></br> 
        	<label class="col-md-4 radio-simple">
	         <input type="radio" name="wtsel" ng-model="filter.wtsel" value="NONHW" /> {{tr_c.NoHazardouswaste}} </BR> ({{quantityNONHW | number}} {{tr_c.Facilities}})
	        </label>
	        <label class="col-md-4 radio-simple">
	         <input type="radio" name="wtsel" ng-model="filter.wtsel" value="HWIC" /> {{tr_c.HazardouswasteWithinCountry}} </BR> ({{quantityHWIC | number}} {{tr_c.Facilities}})
	        </label>
	        <label  class="col-md-4 radio-simple">
	         <input type="radio" name="wtsel" ng-model="filter.wtsel" value="HWOC" /> {{tr_c.HazardouswasteTransboundary}} </BR> ({{quantityHWOC | number}} {{tr_c.Facilities}})
         	</label>
         	</div>
         	</BR>
  </div>

 * 
 */