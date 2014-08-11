var mod = angular.module('jp.authentication', ['jp.http', 'jp.errorHandling','userModule','restangular']);

var factories = {};

factories.authenticationService = function($q, SessionService, User, API, Restangular) {
	var cacheSession = function() {
		SessionService.set("authenticated", true);
	}

	var uncacheSession = function(){
		SessionService.set("authenticated", false);
	}

	var isLoggedIn = function() {
		return SessionService.get('authenticated');
	}

	var currentUser;

	var setUser = function(userJSON) {
		currentUser = userJSON;
	}

	var getUser = function() {
		if (isLoggedIn() && userIsSet()) {
			return currentUser;
		} else {
			return false;
		}
	}

	var unsetUser = function() {
		if (isLoggedIn() && userIsSet()) {
			currentUser = undefined;
		}
	}

	var userIsSet = function() {
		if (angular.isUndefined(currentUser)) {
			return false;
		} else {
			return true;
		}
	}

	var getUserProfile = function(obj) {
		return Restangular.one('profiles',obj.username).get();
	}

	var setupLocalSession = function(user)
	{
		var d = $q.defer();

		cacheSession();
		setUser(user);
		return d.resolve();
	}

	return {
		login: function(credentials) {
			var d = $q.defer()
			var login = API.post('api/v1/login', credentials);
			login.then(
				function(obj){
					console.log('successAuthentication');
					// Handle errors here
					cacheSession();
					setUser(obj);
					var obj = getUser(obj);
					d.resolve();
				},
				function(){
					uncacheSession();
					d.reject();
				});
			
			return d.promise;
		},
		logout: function() {
			var logout = API.post("api/v1/logout");
			logout.then(
				function(){
					unsetUser();
					uncacheSession();
					FlashService.show('Successfully logged out!', 'success');
				},
				function(){

				});

			return logout;
		},
		determineAuthState: function() {
			return API.get('api/v1/users/get-auth-info')
			.then(
				getUserProfile,
				function(data) { 
					return $q.reject(data[0].message) 
				})
			.then(setupLocalSession);
		},
		isLoggedIn: function() {
			return isLoggedIn();
		},
		getUser: function() {
			return getUser();
		}
	}
}

factories.SessionService = function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  }
};

mod.factory(factories);