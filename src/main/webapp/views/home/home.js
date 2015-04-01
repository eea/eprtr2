'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', [function() {
}])

.factory('formatStrFactory', function(){
	return {
		getStrFormat: function(value){
			var fstr = '';
			if(value === undefined)
			{
				fstr = '-';
				return fstr;
			}
			var val = parseFloat(value);
			if(val === NaN)
			{
				return 'format error';
			}
			if(val === 0)
			{
				fstr = val;
			}else if(val < 1)
			{
				// gram round to 1 dec
				fstr =  (Math.round((val * 1000) * 10) / 10).toString() + ' g';
			}else if(val < 1000)
			{
				// kg round to 3 dec
				fstr =  (Math.round(val * 100) / 100).toString() + ' kg';
			}else
			{
				// Tons 3 dec 
				fstr =  (Math.round((val / 1000) *100) / 100).toString() + ' t';
			}
			return fstr;
		}
	}
})

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

