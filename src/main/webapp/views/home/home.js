'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope',function($scope) {
	$scope.queryParams = {};
	$scope.queryParams.ReportingYear = -1;
}])

/*
 * This service returns the resource part (type) requested
 * Look at the resource files in \translations folder for part overview
 * */
.service('translationService', function($http, $q) {
      return {
    	  get: function(type) {
        	var deferred = $q.defer();
        	//We extend the service at some point with language - we can get it from cookie or drop down:
        	//language = (language == undefined || language == '')? 'en-gb': language;
        	var language = 'en-gb';
		    var languageFilePath = 'translations/eprtr-resource_' + language + '.json';
          $http.get(languageFilePath).success(function(results) {
        	  if(type != undefined && type != ''){
        		  results = results[type];
        	  }
            deferred.resolve(results) 
          },
          function(errors) {
            deferred.reject(errors);
          },
          function(updates) {
            deferred.update(updates);
          });
          return deferred.promise;
        }
      };
    });

