var app = angular.module('app', 
	[
		'ui.router',
		'angularMoment',
		'restangular',
		'angulartics',
		'angulartics.google.analytics',
		'jp.config',
		'jp.login',
		'jp.signup',
		'jp.activitiespage',
		'jp.social',
		'jp.profile',
		'jp.masterCtrl',
		'jp.friend',
		'jp.http',
		'jp.utilities',
		'jp.authentication',
		'jp.api.config',
		'jp.route.config',
		'jp.flash',
		'jp.notifications'
	]);

// ANGULARTICS EVENT CONFIGURATION
// -------------------------------
app.constant('ANGULARTIC_EVENT', {
	LOGIN: {
		action: 'Login',
		category: 'Login',
		label: 'Login'
	},
	SIGN_UP: {
		action: 'Sign up',
		category: 'Sign up',
		label: 'Sign up'
	},
	TERMS_OF_SERVICE: {
		action: 'Terms of Service',
		category: 'misc',
		label: 'Terms of Service'
	},
	NAV_BAR: {
		PROFILE: {
			action: 'Profile Page',
			category: 'Navigation',
			label: 'Clicking on their own profile page'
		}
	},
	ACTIVITY: {
		COMMENT: {
			action: 'Activity comment',
			category: 'Activity',
			label: 'User created new comment'
		},
		JOIN: {
			action: 'Activity join',
			category: 'Activity',
			label: 'User has joined an activity'
		},
		CANCEL: {
			action: 'Activity cancel',
			category: 'Activity',
			label: 'Host has canceled activity'
		},
		LEAVE: {
			action: 'Activity leave',
			category: 'Activity',
			label: 'User has left activity'
		},
		CHANGE: {
			DATE: {
				action: 'Activity change date',
				category: 'Activity.modification',
				label: 'Host changed date of activity'
			},
			TIME: {
				action: 'Activity change time',
				category: 'Activity.modification',
				label: 'Host changed time of activity'
			},
			LOCATION: {
				action: 'Activity change location',
				category: 'Activity.modification',
				label: 'Host changed location of activity'
			}
		}
	},
	ACTIVITY_CARD: {
		OTHERS: {
			action: 'Activity Card Others',
			category: 'Activity.Card',
			label: 'User clicked on Others on an Activitys card'
		},
		FRIENDS: {
			action: 'Activity Card Friends',
			category: 'Activity.Card',
			label: 'User clicked on Friends on an Activitys card'
		},
		OVERVIEW: {
			action: 'Activity Card Overview',
			category: 'Activity.Card',
			label: 'User clicked on Overview on an Activitys card'
		}
	},
	ACTIVITY_LIST: {
		DATE_PICKER: {
			action: 'Activity Card Date Picker',
			category:'Activity.List',
			label: 'User clicked on Date Picker in Activity list'
		}
	},
	ACTIVITY_CREATE_FORM: {
		SUBMIT: {
			action: 'Activity Hosted',
			category: 'Activity.Hosted',
			label: 'User hosted a new activity'
		}
	}
});

// ROOT SCOPE CONSTANT DEFINITION
// ------------------------------
app.run(['ANGULARTIC_EVENT', '$rootScope', function(ANGULARTIC_EVENT, $rootScope) {
	$rootScope.ANGULARTIC_EVENT = ANGULARTIC_EVENT;
}]);
	

// STATE (UI-ROUTER) PROVIDER CONFIGURATION
// ----------------------------
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	var access = 
	{
		auth: 'auth',
		anon: 'anon'
	}

	$urlRouterProvider
	.otherwise('/login');

	$stateProvider
	.state("landing", {
		url: "/landing",
		templateUrl: "app/modules/landing/landing.html"
	})
	.state("login", {
		url: "/login",
		templateUrl: "app/modules/login/login.html",
    controller: 'loginCtrl'
	})
	.state('signup',{
		url: "/signup",
		templateUrl: "app/modules/signup/signup.html"	
	})
	.state('terms', {
		url: "/terms",
		templateUrl: "app/modules/terms/terms.html"
	})
	.state('main', {
		abstract: true,
		templateUrl: "app/modules/activities/mainpage.tmpl.html",
		controller: "masterCtrl",
		resolve: {
			loggedIn: function(authenticationService) {
				return authenticationService.determineAuthState()
					.then(function(){
						return true;
					},
					function(){
						return false;
					})
				}
		}
	})
	.state('main.activities', {
		abstract: true,
		url: "/activities",
		views: {
			"header": {
				template: "<div ui-view='header'/>"
			}, 
			"body": {
				template: "<div ui-view='body'/>"
			}
		}
	})
	.state('main.social', {
		abstract: true,
		url: "/social",
		views: {
			"header": {
				template: "<div ui-view='header'/>"
			}, 
			"body": {
				template: "<div ui-view='body'/>"
			}
		}
	})
	.state('main.social.list', {
		url: "/",
		views: {
			"header": {
				templateUrl: "app/modules/activities/partials/detailedheader.tmpl.html"
			}, 
			"body": {
				templateUrl: "app/modules/social/social.html",
				controller: "socialController"
			}
		},
		resolve: {
			peopleusers: function(UserSvc) {
				return UserSvc.getUserIds().then(
					function(data){
						return data;
					});
			}
		},
		data: {
			access: access.auth
		}
	})
	.state('main.profile', {
		url: "/:username",
		views: {
			"header": {
				templateUrl: "app/modules/activities/partials/detailedheader.tmpl.html"
			},
			"body": {
				templateUrl: "app/modules/profile/profilebody.tmpl.html",
				controller: "profileController"
			}
		},
		resolve: {
			payload: function($stateParams, $state, FlashService, Restangular, authenticationService, FriendService, $q) {
				var d = $q.defer();
				var payload = {};
				if (authenticationService.getUser().username == $stateParams.username) {
					payload.user = authenticationService.getUser();
					d.resolve(payload);
				} else {
					Restangular.one('profiles',$stateParams.username).get()
					.then(
						function(data) {
							payload.user = data;
							FriendService.getFriendStatus(data.numeric_id)
							.then(function(data) {
								payload.friendStatus = data;
								d.resolve(payload);
							});
						},
						function() {
							FlashService.show('User cannot be found', 'error');
							$state.go('main.social.list');
							d.reject;
						}
					);
				}
				return d.promise;
			}
		},
		data: {
			access: access.auth
		}
	})
	.state('main.notifications', {
		url: '/notifications/',
		views: {
			"header": {
				templateUrl: "app/modules/activities/partials/detailedheader.tmpl.html"
			},
			"body": {
				templateUrl: "app/modules/notifications/notifications.body.tmpl.html",
				controller: "notificationsController"
			}
		},
		resolve: {
			friendNotifications: function(notificationsFactory) {
				return notificationsFactory.getFriendNotifications();
			},
			activityNotifications: function(notificationsFactory) {
				return notificationsFactory.getActivityNotifications();
			}
		},
		data: {
			access: access.auth
		}
	});

}]);

// CROSS DOMAIN CONFIGURATION
// --------------------------
app.config(['$httpProvider', function($httpProvider) {

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);

// ANGULAR MOMENT TIMEZONE CONFIGURATION
// -------------------------------------
app.constant('angularMomentConfig', {
	timezone: 'America/Detroit'
});

// RESTANGULAR CONFIGURATION
// -------------------------
app.run(['Restangular','API','DateTimeService','BASE_URL','BASE_API_ROUTE','BASE_URL_DIRECTORY','Interceptors','api_const',
	function(Restangular, API, DateTimeService, BASE_URL, BASE_API_ROUTE, BASE_URL_DIRECTORY, Interceptors, api_const) {
	Restangular.setBaseUrl(BASE_URL_DIRECTORY+'/'+BASE_API_ROUTE);
	Restangular.setParentless([api_const.comments,api_const.participants]);
	// REQUEST INTERCEPTOR
	// ----------------------------------------------------------------------------
	Restangular.addRequestInterceptor(function(element,operation,what,url){
		var payload;
		var dates = DateTimeService.getDefaultDateRange();
		if (operation == 'put') {
			switch (what) {
				case api_const.profiles:
					payload = angular.copy(element.profile);
					return Interceptors.Request(payload);
				case api_const.activities:
					payload = angular.copy(element);
					// Set endingtime date to be the same as startingtime
					var momentStartTime = moment.tz(payload.startingtime, 'Etc/UTC');
					payload.endingtime = moment.tz(payload.endingtime, 'Etc/UTC');
					payload.endingtime.set('date',momentStartTime.date());
					payload.endingtime.set('month',momentStartTime.month());
					payload.endingtime.set('year',momentStartTime.year());

					// Serialize Moments and Dates into MySqlFormat
					payload = DateTimeService.SerializeMomentsToUTC(payload);
					return Interceptors.Request(payload);
			}
		}
		if (operation == 'post' || operation == 'put') {
			payload = Interceptors.Request(element);
		}
		// Pass element through request transformer
		return payload;
	});
	// RESPONSE INTERCEPTOR
	// ----------------------------------------------------------------------------
	Restangular.addResponseInterceptor(function(data,operation,what,response,deferred){
		if (what == api_const.activities && operation != 'post' && operation != 'put') {
			return data.obj.data;
		}
		return data.obj;
	});
	// PROFILES
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.profiles,false, function(element) {
		if (element.fromServer)
		{
			// Augment object
			element.numeric_id = element.id;
			element.id = element.username;
			if (element.last_login == null) {
				element.last_active = new Date(element.created_at);
			} else {
				element.last_active = new Date(element.last_login);		
			}
		}
		return element;
	});
	// ACTIVITIES
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.activities, false, function(element) {
		if (element.fromServer)
		{
			// Deserialize Sql Time format to moments
			element.startingtime = moment.tz(element.startingtime, 'Etc/UTC').tz('America/Detroit');
			element.endingtime = moment.tz(element.endingtime, 'Etc/UTC').tz('America/Detroit');

			// COMMENTS
			Restangular.restangularizeCollection(
				element,
				element.comments.data,
				api_const.comments);

			// PARTICIPANTS
			Restangular.restangularizeCollection(
				element,
				element.activityJoined.data,
				api_const.participants);
		}
		return element;
	});
	// COLLECTION ACTIVITY.PARTICIPANTS
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.participants, true, function(element) {

		for (var i = 0; i < element.length; i++)
		{
			Restangular.restangularizeElement(element, element[i], api_const.participants);
		}

		return element;
	});
	// ACTIVITY.PARTICIPANTS
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.participants, false, function(element) {

		element.first_name = element.username;
		
		return element;
	})
	// ACTIVITY.COMMENTS
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.comments, false, function(element) {
		element.date = moment.tz(element.date, 'Etc/UTC').tz('America/Detroit');

		return element;
	})
	// COLLECTION ACTIVITY.COMMENTS
	// ----------------------------------------------------------------------------
	Restangular.addElementTransformer(api_const.comments, true, function(element) {

		var i;
		for (i = 0; i < element.length; i++){
			Restangular.restangularizeElement(element, element[i], api_const.comments);
		}

		return element;
	});
}]);

// STATE-DRIVEN REROUTING
// ----------------------
app.run(['$rootScope','$state','authenticationService', 'access', 'FlashService', 
	function($rootScope, $state, AuthSvc, access, FlashService){
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
  	if (toState.name == 'login' && fromState.name != 'signup')
  	{
  		var prop = angular.copy(AuthSvc.getAttemptStateAndParams());
  		if (prop) 
  		{
  			// No need to store the property
  			return;
  		}
  		else 
  		{
  			AuthSvc.saveAttemptStateAndParams(fromState.name, fromParams);
  			return;
  		}
  	}
  	if (fromState.name == 'login' && toState.name != 'signup')
  	{
  		var prop = angular.copy(AuthSvc.getAttemptStateAndParams());
  		if (prop) {
  			event.preventDefault()
  			AuthSvc.clearAttemptStateAndParams();
  			AuthSvc.getAttemptStateAndParams();
  			$state.go(prop.state, prop.params)
  		} else {
  			// Login's default state transition
  			return;
  		}
  	}
		if (angular.isDefined(toState.data) && toState.data.access == access.auth) {
			if (AuthSvc.isLoggedIn()) {
				// Proceed with default state transition
				return;
			} else {
				event.preventDefault()
				AuthSvc.saveAttemptStateAndParams(toState.name, toParams);
				FlashService.show('You need to login first', "info");
				$state.go('login');
			}
		}
	});
}]);

app.directive('navCollapse', [function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var visible = false;
 
            element.on('show.bs.collapse', function () {
                visible = true;
            });

            element.on("hide.bs.collapse", function () {
                visible = false;
            });

            element.on('click', function(event) {
                if (visible && 'auto' == element.css('overflow-y')) {
                    element.collapse('hide');
                }
            });
        }
    };
}]);

app.directive('autoFillSync', ['$timeout', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          $timeout(function () {
              var newVal = elem.val();
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
              }
          }, 500);
      }
   }
}]);