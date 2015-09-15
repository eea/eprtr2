'use strict';

angular.module('myApp.pollutantinfo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pollutantinfo', {
    templateUrl: 'views/pollutantinfo/pollutantinfo.html',
    controller: 'PollutantInfoCtrl'
  });
}])

.controller('PollutantInfoCtrl', ['$scope','$filter', 'translationService', 'searchFilter', '$http', function($scope, $filter, searchFilter, translationService, $http) {
	
		/*translationService.get('Static').then(function (data) {
		$scope.welcome = data['HomeWelcomeText'];
    });*/
	//HomeWelcomeText
	$scope.searchFilter = searchFilter;
	$scope.showPollutantDetails = false;
	
	$scope.$watchCollection('[prfilter.pgselect, prfilter.pselect]', function(newvalue,oldvalue){
			$scope.pollutants = newvalue;
			if($scope.pollutants[1] != undefined && $scope.pollutants[1].hasOwnProperty("lov_PollutantID")){
				$scope.showPollutantDetails = true;
			}
	});
	
	$scope.getHeadData = function(){
		$http.get('translations/pollutants_labels_en-gb.json').success(function(data, status) {
			for(var i = 0; i<data.labels.label.length;i++){
				var label = data.labels.label[i];
				switch(label._id){
				case 'pollutanthead':
					$scope.label_pollutant_head = label._text;
					break;
				case 'pollutantheadnotes':
					$scope.label_pollutant_headnotes = label._text;
					break;
				case 'pollutantheadlink':
					$scope.label_pollutant_headlink = label._text;
					break;
				case 'pollutantheadlink2':
					$scope.label_pollutant_headlink2 = label._text;
					break;
				case 'pollutantheadlinkLabel':
					$scope.label_pollutant_headlink_label = label._text;
					break;
				case 'pollutantheadnotes2':
					$scope.label_pollutant_headnotes2 = label._text;
					break;
				case 'pollutantheadnotes3':
					var text = label._text;
					var sub = label.sub;
					$scope.label_pollutant_headnotes3 = $scope.stringReplaceSub(text,sub);
					break;
				}
			}
		})
	};
	
	$scope.stringReplaceSub = function(str, subs){
		if(subs == undefined || subs.length<1){
			return str;
		}
		var sub_length = 0;
		if(subs instanceof Array){
			sub_length = subs.length;
		}else{
			sub_length=1;
			subs = [subs];
		}
		
		var counter = 0;
		for(var i = 0; i<subs.length; i++){
			var index = str.indexOf("\n");
			if(index == -1){
				str += '<sub>'+subs[i]+'</sub>';
			}else{
				str = str.substring(0,index)+ '<sub>'+subs[i]+'</sub>'+str.substring(index+1,str.length);
			}
		}
		return str;
	}
	
	$scope.getHeadData();
		
}]).directive('pollutantinfo', function() {
	return {
		restrict: 'E',
		controller: 'PollutantInfoCtrl',
        transclude: true,
		scope: {},
		templateUrl: 'views/pollutantinfo/pollutantinfo.html',
		link: function(scope, element, attrs){
		}
	};
});;