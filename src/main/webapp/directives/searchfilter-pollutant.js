
'use strict';
// a directive to auto-collapse long text
// in elements with the "dd-text-collapse" attribute
//angular.module('myApp.textcollapse', [])
myApp.directive('sfPollutant', ['$compile','$http', '$filter', 'Restangular', 'translationService', 'pollutantService', 
                                function($compile,$http, $filter, Restangular, translationService, pollutantService) {

    return {
        restrict: 'A',
        scope: {
        	queryparams: '=',
        	pgselect: '=',
        	pselect: '=',
        	grpOnly: '=',
        	useheaders: '='
        },
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            var allPollutantGroups = {name: 'All pollutant groups'};
            var allPollutants = {name: 'All pollutants'};

    		translationService.get().then(function (data) {
    			scope.tr_c = data.Common;
    			scope.tr_lpo = data.LOV_POLLUTANT;
    	    });
    		scope.polfilter = {};

            scope.$watch('polfilter.selectedPollutantGroup', function(value){
            	if(scope.polfilter.selectedPollutantGroup != undefined 
            			&& scope.polfilter.selectedPollutantGroup != allPollutantGroups){
            		scope.pgselect = scope.polfilter.selectedPollutantGroup;
            	}
            });

            scope.$watch('polfilter.selectedPollutant', function(value){
            	if(scope.polfilter.selectedPollutant != undefined &&
            			scope.polfilter.selectedPollutant != allPollutants){
            		scope.pselect = scope.polfilter.selectedPollutant;
            	}
            });
    		
    		scope.$watch('polfilter', function() {
    			if (scope.polfilter!= undefined){
		            scope.pollutantGroups = [];
		            if (scope.polfilter.selectedPollutantGroup != undefined){
		            	delete (scope.polfilter.selectedPollutantGroup);
		            }
		            if (scope.useheaders) {
		                scope.pollutantGroups = [allPollutantGroups];
		                scope.polfilter.selectedPollutantGroup = allPollutantGroups;
		            }
		            pollutantService.getList().then(function (data) {
		                scope.pollutantGroups = scope.pollutantGroups.concat(data);
		                scope.polfilter.selectedPollutantGroup = scope.pollutantGroups[0];
		            });
    			}
    		});
            scope.$watch('polfilter.selectedPollutantGroup', function() {
    			if (scope.polfilter!= undefined){
	                scope.pollutants = [];
	                if (scope.polfilter.selectedPollutant != undefined){
	                	delete (scope.polfilter.selectedPollutant);
	                }
	                if (scope.useheaders) {
	                    scope.pollutants = [allPollutants];
	                    scope.polfilter.selectedPollutant = allPollutants;
	                }
	                if (scope.polfilter.selectedPollutantGroup && scope.polfilter.selectedPollutantGroup.lov_PollutantID && !scope.grpOnly) {
	                    pollutantService.getList({ParentID: scope.polfilter.selectedPollutantGroup.lov_PollutantID}).then(function (data) {
	                        scope.pollutants = scope.pollutants.concat(data);
	                        scope.polfilter.selectedPollutant = scope.pollutants[0];
	                    });
	                }
	                if (scope.polfilter.selectedPollutantGroup && scope.polfilter.selectedPollutantGroup.lov_PollutantID) {
	                	//scope.polfilter.PollutantGroup = scope.polfilter.selectedPollutant;
	            		scope.queryparams.LOV_PollutantGroupID = scope.polfilter.selectedPollutantGroup.lov_PollutantID;
	            	}
    			}
            });

            scope.$watch('polfilter.selectedPollutant', function() {
    			if (scope.polfilter!= undefined){
	                if (scope.polfilter.selectedPollutant && scope.polfilter.selectedPollutant.lov_PollutantID) {
	                	//scope.polfilter.Pollutant = scope.polfilter.selectedPollutant;
	                	scope.queryparams.LOV_PollutantID = scope.polfilter.selectedPollutant.lov_PollutantID;
	                } 
    			}
            });
            
    		scope.$watchCollection('[pollutantGroups,tr_c]', function(value) {
    			
                if (scope.pollutantGroups != undefined && scope.tr_c != undefined ) {
                	var body = '<div class="form-group"><label class="control-label" for="inputPollutantGroup">Pollutant Group</label>';
                	body += '<select class="form-control" ng-model="polfilter.selectedPollutantGroup" ng-options="c.name for c in pollutantGroups" id="inputPollutantGroup"></select></div>';
                	body += '<div class="form-group" ng-if="!grpOnly"><label class="control-label" for="inputPollutant">Pollutant</label>';
                	body += '<select class="form-control" ng-model="polfilter.selectedPollutant" ng-options="c.name for c in pollutants" id="inputPollutant"></select></div>';
                    element.empty();
                    element.append($compile(body)(scope));
                }
                else {
                    element.empty();
                }
    		
    		});

    	}
    };
}]);
