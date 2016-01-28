'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$rootScope', '$filter', 'eprtrcms', '$http' , function($scope, $rootScope,  $filter,  eprtrcms, $http) {
	/**
	 * DO NOT REMOVE - part of home.test
	 */
	$scope.test = function(inp){
		return inp;
	}
    $scope.mapctrl = {};
    

	
	eprtrcms.get('Static',null).then(function (data) {
		$scope.tr_f = data;
		$scope.welcome = data.HomeWelcomeText;
	});

	$scope.mapheight = window.innerHeight > 820 ? 600+'px' : (window.innerHeight -190)+'px';
	
    $scope.$watch('mapctrl', function(value) {
    	if(typeof $scope.mapctrl.redraw == 'function'){
        	$scope.mapctrl.redraw();
        }
    });

    $scope.$on('mapctrl', function(){
        $scope.mapctrl.redraw();
      });
    
    angular.element(document).ready(function () {
    	if($scope.mapctrl && typeof $scope.mapctrl.redraw == 'function'){
    		$scope.mapctrl.redraw();
    	}
    });
    


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

.factory('countFactory', ['$filter', 'formatStrFactory', function($filter,formatStrFactory){
	return {
		getTypeCount :function(elements){  
		  	if(!elements.length)
		  	{
		  		elements = jQuery.makeArray(elements);
		  	}  
		      var total = 0;
		      for(var i = 0; i < elements.length; i++){
		          	total += elements[i].facilityCount;
		       
		      }
		      return total;
		},
        getFacilityCount : function(elements){  
      
	    	if(!elements.length)
	    	{
	    		elements = jQuery.makeArray(elements);
	    	}  
	        var total = 0;
	        for(var i = 0; i < elements.length; i++){
	            	total += elements[i].facilityTotalCount;
	         
	        }
	        return total;
        },
        getSum : function(elements, type, unit)
        {
        	if(!elements.length)
        	{
        		elements = jQuery.makeArray(elements);
        	}
        	var sum = 0;
    		for(var i = 0; i < elements.length; i++)
			{
				 var temp = elements[i][type];
				 if(temp)
				 {
					 sum += temp;
				 }
			}
    		if(sum === 0)
    		{
    			return "-";
    		}
    		if (unit){
        		return formatStrFactory.getStrFormat(sum);
    		}
    		else{
    			return $filter('number')(sum);
    		}
        },
        getSubSum : function(elements,property,unit){  
	      
	    	if(!elements.length)
	    	{
	    		elements = jQuery.makeArray(elements);
	    	}  

	    	var total = 0;
	        for(var i = 0; i < elements.length; i++){
	        	if(elements[i].sublevel)
	        	{ 
		        	for(var j = 0; j < elements[i].sublevel.length; j++){
		        		total += elements[i].sublevel[j][property];
		        	}
	        	}
	        	else if(elements[i].data)
	        	{ 
		        	for(var j = 0; j < elements[i].data.length; j++){
		        		total += elements[i].data[j][property];
		        	}
	        	}
	        	else
	        	{ 
	        		continue;
	        	}
	        }
    		if (unit){
        		return formatStrFactory.getStrFormat(total);
    		}
    		else{
    			return $filter('number')(total);
    		}
//	        return total;
	    },
	    getTypeCountAccidential : function(elements){  
      
	    	if(!elements.length)
	    	{
	    		elements = jQuery.makeArray(elements);
	    	}  
	        var total = 0;
	        for(var i = 0; i < elements.length; i++){
	            	total += elements[i].facilityAccidentalCount; 
	        }
	        return total;
	    },
	  
		getformat : function(value)
		{
			if(!value || value === 0)
			{
				return "-";
			}
			return formatStrFactory.getStrFormat(value);
		},
  
		  getpctformat : function(value)
		  {
				if(value === 0)
				{
					return "-";
				}
				return value+"%";
		  },
		  findGroup : function(collection,key)
	        {
	        	for(var i = 0; i < collection.length;i++)
	        	{
	        		if(collection[i].key === key)
	        		{
	        			return collection[i];
	        		}
	        	}
	        }
	}
}])

.service('eprtrcms', function($http, $q) {
    	var res ={'Activity':{},'AreaOverview':{},'ChartLabels':{},'Common':{},'Confidentiality':{},
    			'DiffuseSources':{},'Facility':{},'FAQ':{},'FilterAllWidgetStrings':{},'Glossary':{},'Help':{},'IndustrialActivity':{},'LCP':{},
    			'Library':{},'LOV_ANNEXIACTIVITY':{},'LOV_AREAGROUP':{},'LOV_CONFIDENTIALITY':{},'LOV_COUNTRY':{},
    			'LOV_MEDIUM':{},'LOV_METHODBASIS':{},'LOV_METHODTYPE':{},'LOV_NACEACTIVITY':{},'LOV_NUTSREGION':{},
    			'LOV_POLLUTANT':{},'LOV_REGULATION':{},'LOV_RIVERBASINDISTRICT':{},'LOV_UNIT':{},'LOV_WASTETREATMENT':{},
    			'LOV_WASTETYPE':{},'MAP_BookmarkWidgetStrings':{},'MAP_ControllerStrings':{},'MAP_FilterAllWidgetString':{},
    			'MAP_FilterAllWidgetStrings':{},'MAP_GazetteerWidgetStrings':{},'MAP_LookupSearchAllWidgetStrings':{},
    			'MAP_OverviewMapWidgetStrings':{},'MAP_PrintWidgetStrings':{},'MAP_SearchAllWidgetStrings':{},
    			'MAP_WidgetTemplateStrings':{},'MapSearch':{},'Pollutant':{},'Static':{},'Timeseries':{},'WasteTransfers':{},'Pollutantinfo':{},'SURVEY':{}};
    	
    	return {
    	  get: function(type,i18n) {
        	var deferred = $q.defer();
        	//We extend the service at some point with language - we can get it from cookie or drop down:
        	//language = (language == undefined || language == '')? 'en-gb': language;
        	var language = (i18n)?i18n:'en-gb';
        	if(res[type] && typeof res[type] !== 'string' && Object.keys(res[type]).length < 1){
        		var _qp = 'eprtrresource?i18n='+language+'&Type='+type;

    		    $http.get(_qp).success(function(results) {
        			angular.forEach(results, function(item) {
        				res[type][item.type]= item.value;
	        		});
    	        	  deferred.resolve(res[type]); 
    			    },
	          function(errors) {
	            deferred.reject(errors);
	          },
	          function(updates) {
	            deferred.update(updates);
	          });
        	}
        	else{
        		deferred.resolve(res[type]);        		
        	}
          return deferred.promise;
        }
      };
    })

 .service('eprtrmaps', function($http, $q) {
	 var mapurls={};

	 return {
		 get: function() {
			 var deferred = $q.defer();
			//We extend the service at some point with language - we can get it from cookie or drop down:
			 if(Object.keys(mapurls).length < 1){
				 var _qp = '/mapurls';
		
				 $http.get(_qp).success(function(results) {
					 angular.forEach(results, function(value, key) {
						mapurls[key]= value;
					 });
		        	 deferred.resolve(mapurls); 
				 },
				 function(errors) {
					 deferred.reject(errors);
				 },
				 function(updates) {
					 deferred.update(updates);
				 });
			}
			else{
				deferred.resolve(mapurls);        		
			}
			 return deferred.promise;
		 }
	};
})


.service('emissionsService', function($http, $q) {
      return {
    	  get: function(type) {
        	var deferred = $q.defer();
        	//We extend the service at some point with language - we can get it from cookie or drop down:
        	//language = (language == undefined || language == '')? 'en-gb': language;
        	var language = 'en-gb';
		    var languageFilePath = 'translations/diffusesources_' + language + '.json';
          $http.get(languageFilePath).success(function(results) {
        	  if(type != undefined && type != ''){
        		  results = results['DiffuseSources'][type];
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


