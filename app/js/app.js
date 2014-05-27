var app = angular.module('app', 
	[
		'ui.router',
		'jp.login',
		'jp.signup'
	]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
	.otherwise('/');

	$stateProvider
	.state("login", {
		url: "/login",
		templateUrl: "modules/login/login.html"
	})
	.state('signup',{
		url: "/signup",
		templateUrl: "modules/signup/signup.html"	
	})
	.state('activitylist', {
		url: "/activitylist",
		templateUrl: "activity-list.html"
	})
}]);