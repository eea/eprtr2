'use strict';

angular.module('myApp.survey', ['ngRoute','restangular','ngSanitize','mgo-angular-wizard'])

.controller('SurveyController', 
	['$scope', '$http', '$modal', 'Restangular', 'eprtrcms', 
	function($scope, $http, $modal, Restangular, eprtrcms) {
//'$cookieStore'
	$scope.qradio = {};
	var _now = new Date();
	$scope.expiredate = new Date(new Date(_now).setMonth(_now.getMonth()+3)).toUTCString();

	//var _threemonthsago = new Date(new Date($scope.now).setMonth($scope.now.getMonth()-3));
	
	/*var oldsurvey = $cookies.get('eprtrsurvey');
	if(oldsurvey){
		if(!oldsurvey.ansvered && Date(oldsurvey.date)<_threemonthsago){
			console.log('We can ask again');
		}
	}*/
	eprtrcms.get('SURVEY',null).then(function (data) {
		$scope.tr_sur = data;
	});

	$scope.restconfig = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setFullResponse(true);
    });

	/**
	 * Query service for questions
	 */
	$scope.surveyQuestionsService = $scope.restconfig.all('eprtrsurveyquestions');
	$scope.surveyQuestionsService.getList().then(function(response) {
		var resp = response.data;
		angular.forEach(resp, function(survey) {
			survey["btnnotxt"] = "";
			survey["btngotxt"] = "Continue";
			survey["btnfinishtxt"] = "";
			survey["surveyText"] = "<b>" +survey["surveyText"] +"</b>";
		});
		resp.unshift({"surveyID":-1,
			"surveyText":$scope.tr_sur['SURVEY.ParticipateText'], //'<h3>The introduction text asking for your participation</h3><h3>Would you like to participate?</h3>',
			"surveyLabel":"Hello",
			"index":-1,
			"surveyItems":[],
			"btnnotxt":"No",
			"btngotxt":"Yes",
			"btnfinishtxt":""});
		resp.push({"surveyID":99,
			"surveyText":$scope.tr_sur['SURVEY.Thanks'], //'<h3>Thank you for your contribution!</h3>',
			"surveyLabel":"Finish",
			"index":99,
			"surveyItems":[],
			"btnnotxt":"",
			"btngotxt":"",
			"btnfinishtxt":"Finish"})
		
		$scope.surveyitems = resp;
		//survey.btnnotxt
	});

	$scope.validateanswer = function(surveyID){
		if (surveyID < 0 || surveyID == 99) return true;
		return $scope.qradio[surveyID]!=undefined?true:false;
	}
	$scope.finishsurvey = function(){
		/**
		 * Write to service
		 */
		var answers = [];
		angular.forEach($scope.qradio, function(key, val){
			answers.push(key);
		});
		//$scope.surveyResultsService = $scope.restconfig.all('addeprtrsurveyresult').post("result", answers.join(','));
		
		var req = {
				 method: 'POST',
				 url: 'addeprtrsurveyresult?result='+answers.join(',')};
		/*,
				 headers: {
				   'Content-Type': undefined
				 },
				 data: { result: answers.join(',') }
				};*/

		$http(req).then(function(){
			document.cookie= "eprtrsurvey=1; expires=" + $scope.expiredate;
			$scope.finish();
		});
		
		//console.log('Finish');
		/**
		 * write to Cookie
		 */
		//var _expiredate = new Date(new Date($scope.now).setMonth($scope.now.getMonth()+3)).toUTCString();
		//Done
	};

	$scope.cancel = function(){
		document.cookie= "eprtrsurvey=0; expires=" + $scope.expiredate;
		$scope.finish();
	}
	//addeprtrsurveyresult
	
		
}])
 .directive('eprtrsurvey', function() {
 	return {
 		restrict: 'E',
 		controller: 'SurveyController',
 		transclude: true,
 		scope: {
 			finish: '='
 		},
 		templateUrl: 'components/survey/survey.html',
 		link: function(scope, element, attrs){}
 	};
 });
