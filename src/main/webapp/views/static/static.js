'use strict';

angular.module('myApp.staticview', ['ngRoute','restangular','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/static', {
    templateUrl: 'views/static/static.html',
    controller: 'StaticViewController'
  });
}])
.constant('statconf',{
	items:{
		'about':{'c':'AboutPageContent','h':'AboutPageHeader','t':'Static'},
		'downloaddata':{'c':'DownloadDataSetPageContent','h':'DownloadDataSetPageHeader','t':'Static'},
		'downloadguidance':{'c':'DownloadGuidancePageContent','h':'DownloadGuidancePageHeader','t':'Static'},
		'events':{'c':'EventsAndMeetingsPageContent','h':'EventsAndMeetingsPageHeader','t':'Static'},
		'faq':{'c':'FAQPageContent','h':'FAQPageHeader','t':'Static'},
		'feedback':{'c':'FeedbackPageContent','h':'FeedbackPageHeader','t':'Static'},
		'home':{'c':'HomeHeadline','h':'HomeWelcomeText','t':'Static'},
		'linkseu':{'c':'LinksEUinternationalPageContent','h':'LinksEUinternationalPageHeader','t':'Static'},
		'linksnational':{'c':'LinksNationalRegistersPageContent','h':'LinksNationalRegistersPageHeader','t':'Static'},
		'linksresearch':{'c':'LinksResearchProjectsPageContent','h':'LinksResearchProjectsPageHeader','t':'Static'},
		'news':{'c':'NewsPageContent','h':'NewsPageHeader','t':'Static'},
		'people':{'c':'PeopleCommunityPageContent','h':'PeopleCommunityPageHeader','t':'Static'},
		'reviewfact':{'c':'ReviewFactSheetPageContent','h':'ReviewFactSheetPageHeader','t':'Static'},
		'reviewreport':{'c':'ReviewReportPageContent','h':'ReviewReportPageHeader','t':'Static'},
		'activity':{'c':'ActivityPageContent','h':'ActivityPageHeader','t':'Library'},
		'activityeper':{'c':'ActivityPageContentEPER','h':'ActivityPageHeader','t':'Library'},
		'glossary':{'c':'GlossaryPageContent','h':'GlossaryPageHeader','t':'Library'},
		'pollutant':{'c':'PollutantPageContent','h':'PollutantPageHeader','t':'Library'},
		'pollutanteper':{'c':'PollutantPageContentEPER','h':'PollutantPageHeader','t':'Library'},
		'waste':{'c':'WastePageContent','h':'WastePageHeader','t':'Library'}
	}
})

.controller('StaticViewController', 
		['$scope', '$routeParams', 'translationService', 'statconf', function($scope, $routeParams, translationService, statconf ) {

		$scope.id = $routeParams.cont !== undefined ? $routeParams.cont: null;// 10;

		if($scope.id !== null && statconf.items[$scope.id] !== undefined){
//		Requesting text and title resources 
			var item = statconf.items[$scope.id];
			translationService.get(item.t).then(function (data) {
				$scope.content = data[item.c];
				$scope.head = data[item.h];
		    });
		}
}]);

