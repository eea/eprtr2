'use strict';

angular.module('myApp.faqview', ['ngRoute','restangular','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/faq', {
    templateUrl: 'views/static/faq.html',
    controller: 'FaqController'
  });
}])

.controller('FaqController', 
		['$scope', '$routeParams', 'eprtrcms', function($scope, $routeParams, eprtrcms  ) {

		eprtrcms.get('Static',null).then(function (data) {
			$scope.pageTitle = data.FAQPageTitle;
			$scope.pageHeader = data.FAQPageHeader;
		});	

		eprtrcms.get('FAQ',null).then(function (data) {
			$scope.setData(data);
		});	

		$scope.setData = function(data){
			var res = [];
			angular.forEach(data, function(item) {
				res.push(JSON.parse(item));
    		});
			$scope.content = res;
			for(var i = 0; i<$scope.content.length; i++){
				$scope.content[i].show= false;
			}
		}
		/*$scope.getData = function(){
			$http.get('translations/eprtr-resource-static_en-gb.json').success(function(data, status) {
				$scope.content = data.Static.FAQPageContent;
				$scope.pageTitle = data.Static.FAQPageTitle;
				$scope.pageHeader = data.Static.FAQPageHeader;
				for(var i = 0; i<$scope.content.length; i++){
					$scope.content[i].show= false;
				}
			});
		}*/
		
		//$scope.getData();
		
		
}]);

