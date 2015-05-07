'use strict';

angular.module('myApp.diffuseemissions', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diffuseemissions', {
    templateUrl: 'views/emissions/diffuseemissions.html',
    controller: 'DiffuseEmissionsCtrl'
  });
}])

.controller('DiffuseEmissionsCtrl', ['$scope','$filter', 'translationService', function($scope, $filter, translationService) {
	
	$scope.aboutemissions = "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor. " +
			" Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.";
	/*translationService.get('Static').then(function (data) {
		$scope.welcome = data['HomeWelcomeText'];
    });*/
	//HomeWelcomeText
	
}]);