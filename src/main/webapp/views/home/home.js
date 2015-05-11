'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$filter', 'translationService', function($scope, $filter, translationService) {
	/**
	 * DO NOT REMOVE - part of home.test
	 */
	$scope.test = function(inp){
		return inp;
	}
	
	translationService.get('Static').then(function (data) {
		$scope.welcome = data['HomeWelcomeText'];
    });
	//HomeWelcomeText
	
}])

.factory('formatStrFactory', ['$filter', function($filter){
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
				fstr =  ($filter('number',1)(((val * 1000) * 10) / 10)).toString() + ' g';
			}else if(val < 1000)
			{
				// kg round to 3 dec
				fstr =  ($filter('number',3)((val * 100) / 100)).toString() + ' kg';
			}else
			{
				// Tons 3 dec 
				fstr =  ($filter('number',3)(((val / 1000) *100) / 100)).toString() + ' t';
			}
			return fstr;
		},

	    ConfidentialFormat : function(txt, confidential)
	        {
	            var result = '';
	            if (txt!= null && txt != '')
	            {
	                result = txt;
	            }
	            else if (confidential)
	            {
	                result = "CONFIDENTIAL";
	            }
	            else
	            {
	                result = "-"; 
	            }
	            return result;
	        },
	        
		formatMethod:function(amount, conf)    {
	        var result = '';
	        if (amount == null)
	        {
	            result = this.ConfidentialFormat(result, conf);
	        }
	        else
	        {
	            if (amount < 0)
	            {
	                alert("Negative Amount provided" +amount.toString());
	            }
	            else if (amount >= 100000)
	            {
	                result = $filter('number')((amount / 1000), 0) + " t";
	            }
	            else if (amount >= 10000 && amount < 100000)
	            {
	                result = $filter('number')((amount / 1000), 1) + " t";
	            }
	            else if (amount >= 1000 && amount < 10000)
	            {
	                result = $filter('number')((amount / 1000), 2) + " t";
	            }
	            else if (amount >= 100 && amount < 1000)
	            {
	                result = $filter('number')(amount, 0) + " kg";
	            }
	            else if (amount >= 10 && amount < 100)
	            {
	                result = $filter('number')(amount, 1) + " kg";
	            }
	            else if (amount >= 1 && amount < 10)
	            {
	                result = $filter('number')(amount, 2) + " kg";
	            }
	            else if (amount == 0.00)
	            {
	                result = "0";
	            }
	            else if (amount * 10 >= 1 && amount * 10 < 10)
	            {
	                result = $filter('number')((amount * 1000), 0) + " g";
	            }
	            else if (amount * 100 >= 1 && amount * 100 < 10)
	            {
	                result = $filter('number')((amount * 1000), 1) + " g";
	            }
	            else if (amount * 1000 < 10 && amount > 0)
	            {
	                result = $filter('number')((amount * 1000), 3) + " g";
	            }
	        }
	        return result;
	    },

		formatQuantity:function(quantity, unit, conf){
	        if (quantity == null)
	        {
	            return this.ConfidentialFormat(null, conf);
	        }
	        else
	        {
	            if (unit.toLowerCase() == 'unknown')
	            {
	                return this.ConfidentialFormat($filter('number')(quantity), conf);
	            }
	            else if (unit.toLowerCase() == 'tne' || unit.toLowerCase() == 't')
	            {
	                return this.formatMethod(quantity * 1000, conf);
	            }
	            else
	            {
	                return this.formatMethod(quantity, conf);
	            }
	        }
		},
	    DeterminePercent:function(total, accidental)
	    {
	        if (accidental != null && accidental > 0 && total != null)
	        {
	            return $filter('number',5)(((parseFloat(accidental) / parseFloat(total)) * 100)) + " %";
	        }
	        return "0 %";
	    },
	    
	    MethodUsedFormat: function(typeCodes, designations, confidential,tr_lmtn)
	    {
	    	var delim = '<br />'
	        var result = '';
	        var designationSplit = [];
	        var typecodeSplit = [];

	        //designations wll never be given without type codes.
	        if (typeCodes == null || typeCodes == '')
	        {
	            return this.ConfidentialFormat(null, confidential);
	        }
	        else
	        {
	            typecodeSplit = typeCodes.split(delim);

	            if (designations != null && designations != '')
	            {
	                designationSplit = designations.split(delim);
	            }

	            for (var i = 0; i < typecodeSplit.length; i++)
	            {
	                var typeCode = typecodeSplit[i];
	                var designation = designationSplit != null ? designationSplit[i] : null;

	                if (typeCodes != null && typeCodes != '')
	                {
	                    //CEN/ISO is removed as this is also part of the designation
	                    if (typeCode.toUpperCase() != "CEN/ISO")
	                    {
	                        result += "<abbr title=\"" + tr_lmtn[typeCode] + "\"> " + typeCode + " </abbr>";
	                    }

	                    if (designation != null && designation != '')
	                    {
	                        result += " " + "<span title=\""+designation+"\">"+designation+"</span>";
	                    }
	                    result += delim;
	                }
	            }
	        }
	        return result;

	    }
	}
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

