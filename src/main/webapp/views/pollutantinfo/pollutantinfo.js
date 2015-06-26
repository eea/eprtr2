'use strict';

angular.module('myApp.pollutantinfo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pollutantinfo', {
    templateUrl: 'views/pollutantinfo/pollutantinfo.html',
    controller: 'PollutantInfoCtrl'
  });
}])

.controller('PollutantInfoCtrl', ['$scope','$filter', 'translationService', 'searchFilter', '$http', function($scope, $filter, searchFilter, translationService, $http) {
	
	$scope.aboutpollutantinfo = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor. " +
			" Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.";
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
		
}]);