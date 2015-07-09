'use strict';

angular.module('myApp.faqview', ['ngRoute','restangular','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/faq', {
    templateUrl: 'views/faq/faq.html',
    controller: 'FaqController'
  });
}])

.controller('FaqController', 
		['$scope', '$routeParams', 'translationService', '$http', function($scope, $routeParams, translationService, $http ) {

		$scope.getData = function(){
			$http.get('translations/eprtr-resource-static_en-gb.json').success(function(data, status) {
				$scope.content = data.Static.FAQPageContent;
				$scope.pageHeader = data.Static.FAQPageHeader;
				for(var i = 0; i<$scope.content.length; i++){
					$scope.content[i].show= false;
				}
			});
		}
		
		$scope.getData();
		
		
}]);

