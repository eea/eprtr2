'use strict';

angular.module('myApp.pollutanttransfers', ['ngRoute','ngTouch', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pollutanttransfers', {
            templateUrl: 'views/pollutanttransfers/pollutanttransfers.html',
            controller: 'PollutantTransfersCtrl'
        });
    }])

    .controller('PollutantTransfersCtrl', ['$scope', function($scope) {
        $scope.pollutantPanel = true;
        $scope.pollutantPanelTitle = 'Pollutant transfers';
        
        
        $scope.gridOptions = {
        	    expandableRowTemplate: 'expandableRowTemplate.html',
        	    expandableRowHeight: 150,
        	    //subGridVariable will be available in subGrid scope
        	    expandableRowScope: {
        	      subGridVariable: 'subGridScopeVariable'
        	    }
        	  }
        	 
        	  $scope.gridOptions.columnDefs = [
        	    { displayName: ' ', name: 'code'},
        	    { displayName: 'Transfer per industrial activities', name: 'code', grouping: { groupPriority: 0 }, maxWidth: '40%'},
        	    { displayName: ' ', name: 'code'},
        	    { displayName: 'Facilities', name: 'code', grouping: { aggregation: uiGridGroupingConstants.aggregation.COUNT }},
        	    { displayName: 'Quantity', name: 'code', grouping: { aggregation: uiGridGroupingConstants.aggregation.SUM }}
        	  ];
        	 
        
        /*
         * ActivityTreeListRow(string sectorCode, string activityCode, string subActivityCode,
                          string pollutantCode,  
                          int facilities, 
                          double quantity, 
                          bool hasChildren)
         * */
        
        	 /* $http.get('/data/500_complex.json')
        	    .success(function(data) {
        	      for(i = 0; i < data.length; i++){
        	        data[i].subGridOptions = {
        	          columnDefs: [ {name:"Id", field:"id"},{name:"Name", field:"name"} ],
        	          data: data[i].friends
        	        }
        	      }
        	      $scope.gridOptions.data = data;
        	    });*/
        	 
        	    $scope.gridOptions.onRegisterApi = function(gridApi){
        	      $scope.gridApi = gridApi;
        	    };
        	 
    }]);