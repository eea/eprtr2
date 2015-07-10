'use strict';

angular.module('myApp.glossaryview', ['ngRoute','restangular','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/glossary', {
    templateUrl: 'views/static/glossary.html',
    controller: 'GlossaryController'
  });
}])

.controller('GlossaryController', 
		['$scope', '$routeParams', 'translationService', '$http', function($scope, $routeParams, translationService, $http ) {

		$scope.getData = function(){
			$http.get('translations/eprtr-resource-static_en-gb.json').success(function(data, status) {
				$scope.content = data.Library.GlossaryPageContent;
				$scope.pageHeader = data.Library.GlossaryPageHeader;
				$scope.pageTitle = data.Library.GlossaryPageTitle;
				for(var i = 0; i<$scope.content.length; i++){
					$scope.content[i].show= false;
				}
			});
		}
		
		$scope.getData();
		
		
}]);

