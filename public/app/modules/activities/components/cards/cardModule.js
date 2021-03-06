var mod = angular.module('cardModule', 
	[
	'activityModule',
	'angularMoment', 
	'filterModule',
	'searchbar',
	'friendModule',
	'ui.bootstrap',
	'jp.utilities',
	'jp.authentication',
	'jp.utilities',
	'jp.flash']);

var controllers = {};
var factories = {};
var directives = {};

/**
 * Deprecated Card Factory
 * @return {[type]} [description]
 */
factories.cardFactory = function() {
	var factory = {};

	return factory;
};

/**
 * Gathers sorts and filters and orchestrates the communication 
 * from sort & filter controllers to card and expandedCard controllers.
 * @param  {scope} $scope          scope
 * @param  {factory} cardFactory     Factory that contains the cards to display
 * @param  {service} strategyData stores and updates the sorting strategy used
 * @param  {service} activityService stores and updates the activity that's filtered
 * @param  {service} filterService   stores and updates additional filters
 * @return {none}                 none
 */
controllers.cardsController = ['$scope', 'watching', 'filterService', 'activityList', '$state',
function($scope, watching, filterService, activityList, $state) {
	// Base Set of Activities

	function init() {
		$scope.dates = activityList;

		$scope.filterServ = filterService;

		/* Initialize & Watch Filter & Sort strategies */
		/*$scope.sortStrategy = watching.sort($scope);*/
		$scope.activityFilter = watching.activity($scope, setFilterFlag);
		$scope.filterFlag = $scope.filterServ.getFilterFlag();

		$scope.searchFilter = [];
	};

	$scope.checkFilteredCollectionLength = function(curList, filter) {
		if (filter === '' || angular.isUndefined(filter))
		{
			return curList.length
		} else if (angular.isDefined(filter))
		{
			var list = [];

			for (var i = 0; i < curList.length; i ++)
			{
				if (curList[i].sport === filter)
				{
					list.push(curList[i]);
				}
			}
			return list.length;
		}
	}

	$scope.createActivity = function(date, sport)
	{
		$state.go('main.activities.create', {startingtime: date, sport: sport});
	}

	var setFilterFlag = function(val) {
		$scope.filterServ.setFilterFlag(val);
		$scope.filterFlag = val;
	};
	init();
}];

factories.watching = function(searchbarData) {

	/**
	 * Gets the data from a service
	 * @type {Object}
	 */
	var get = {
		activity: function() {
			return searchbarData.getData();
		}
	}

	/**
	 * Watches the service for any changes & updates
	 * scope variable
	 * @type {Object}
	 */
	var watch = {
		activity: function(scope, setFilterFlag) {
			scope.$watch(get.activity, function (newVal, oldVal){
				if (newVal === oldVal){
					return
				}
				scope.activityFilter = newVal;
				setFilterFlag(false);
			});
		}
	};

	return {
		activity: function(scope, setFilterFlag) {
			watch.activity(scope, setFilterFlag);
			return get.activity();
		}
	}
};

/// CONTROLER FOR DIRECTIVE:activitycard
controllers.cardController = ['$scope', '$filter', 'friendService', '$state', function($scope, $filter, friendService, $state) {
	$scope.peopleneeded;
	$scope.neededorfree;
	$scope.stars = [];
	$scope.skillDescription;
	$scope.friendList = [];

	init();
	function init() {
		$scope.friendList = $filter('arrayContains')($scope.activity.participants.list,'areFriends',true);
		$scope.goingList = $filter('arrayContains')($scope.activity.participants.list,'areFriends',false);
	}

	$scope.open = function(activityId) {
		$state.go('main.activities.detail', { id: activityId});
	}

	/**
	 * Retrieves the friend list (Static)
	 * @return {none} none
	 */
	$scope.getFriendList = function(){
		var list = [];
		var friendListString = "";
		list = friendService.getFriendList($scope.activity.participants.list);
		for (var i = 0; i < list.length; i++) {
			friendListString = friendListString + list[i];
			if (i < list.length-1) {
				friendListString += "<br>"
			}
		}
		return friendListString;
	}
}];

controllers.detailedCardController = 
['$scope','$state', 'DateTimeService', 'FlashService', '$http', '$filter', 'activity', 'API', 'authenticationService', 'Comment', function($scope, $state, DateTimeService, FlashService, $http, $filter, activity, API, authenticationService, Comment){
	var IsParticipant;
	var IsOwner;

	var refreshPage = function()
	{
		$state.go($state.$current, null, { reload: true });
	}

	function init() {
		// SERVICES
		$scope.AuthSvc = authenticationService;
		$scope.DTSvc = DateTimeService;
		$scope.FlashService = FlashService;

		// CONSTANTS
		$scope.activity = activity;
		$scope.isOwner = $scope.currentUserIsOwner(activity);
		$scope.isParticipant = $scope.currentUserIsParticipant(activity.activityJoined.data);
		$scope.isEditable = $scope.isBeforeCurrentDate(activity);
		$scope.isFriendsCollapsed = true;
		$scope.isPeopleCollapsed = true;
	  $scope.minDate = moment(new Date());
	  $scope.maxDate = $scope.DTSvc.getDefaultDateRange().endRange;
	  $scope.tabs = [{active: false}, {active: true}, {active: false}];
		$scope.friendList = $filter('arrayContains')($scope.activity.activityJoined.data,'areFriends',true);
		$scope.goingList = $filter('arrayContains')($scope.activity.activityJoined.data,'areFriends',false);


	  // Watch for changes in Date, Start/End Time, Location and Description
	  // Since we're still on Angular 1.2.x, theres no watchGroup.
	  $scope.$watch(function() { return $scope.activity.description},function(newVal,oldVal){
	  	if (newVal != oldVal) {
	  		//$http.put('api/v1/activities/'+$scope.activity.id, newVal);
	  		$scope.activity.put();
	  		$scope.FlashService.show('You have successfully edited the activity', 'success');
	  	}
	  });
	  $scope.$watch(function() { return $scope.activity.location},function(newVal,oldVal){
	  	if (newVal != oldVal) {
	  		//$http.put('api/v1/activities/'+$scope.activity.id, newVal);
	  		$scope.activity.put();
	  		$scope.FlashService.show('You have successfully edited the activity', 'success');
	  	}
	  });
	  $scope.$watch(function() { return $scope.activity.startingtime},function(newVal,oldVal){
	  	if (newVal != oldVal) {
	  		if ($scope.DTSvc.isValidTimeRange($scope.activity.startingtime,$scope.activity.endingtime)) {
		  		$scope.activity.put();
		  		$scope.FlashService.show('You have successfully edited the activity', 'success');
	  		} else {
	  			$scope.FlashService.show('Your Starting Time must be before the end time to save changes', 'error');
	  		}
	  	}
	  });
	  $scope.$watch(function() { return $scope.activity.endingtime},function(newVal,oldVal){
	  	if (newVal != oldVal) {
	  		if ($scope.DTSvc.isValidTimeRange($scope.activity.startingtime,$scope.activity.endingtime)) {
		  		$scope.activity.put();
		  		$scope.FlashService.show('You have successfully edited the activity', 'success');
	  		} else {
	  			$scope.FlashService.show('Your Starting Time must be before the Ending Time to save changes', 'error');
	  		}
	  	}
	  });
	};

	/// Helper functions
	/// --------------------------------------------------------------------
	$scope.currentUserIsParticipant = function(participants) {
		if (angular.isUndefined(IsParticipant)){
			for (var i = 0; i < participants.length; i++) {
				if (participants[i].user_id == $scope.AuthSvc.getUser().numeric_id) {
					IsParticipant = true;
					return IsParticipant;
				}
			}
			IsParticipant = false;
		}
		return IsParticipant;
	}

	$scope.currentUserIsOwner = function(activity) {
		if (angular.isUndefined(IsOwner)) {
			if (activity.user_id == $scope.AuthSvc.getUser().numeric_id) {
				IsOwner = true;
				return IsOwner;
			} else {
				IsOwner = false;
			}
		}
		return IsOwner;
	}

	$scope.isBeforeCurrentDate = function(activity) {
		if (activity.startingtime.isBefore(moment(new Date())))
		{
			return false;
		} else {
			return true;
		}
	}

	/// User actions
	/// --------------------------------------------------------------------
	$scope.join = function(actId) {
		$scope.activity.activityJoined.data.post({activity_id: actId }).then(
			function() {
				FlashService.show('You have joined the activity', 'success');
				refreshPage();
			});
	};

  $scope.unjoin = function(actId) {
  	API.delete('api/v1/activity-join/'+actId).then(
  		function() {
  			FlashService.show('You have left the activity', 'success');
  			refreshPage();
  		});
  }

  // Delete an activity as an owner.
  $scope.cancel = function(actId) {
  	FlashService.show('You have successfully deleted the activity', 'success');
  	API.delete('api/v1/activities/'+actId);
  	$state.go('main.activities.list', null, { reload: true });
  }

	init();
}];

directives.activitycard = [function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'app/modules/activities/partials/activitycard.tmpl.html',
		scope: {
			activity: "="
		},
		controller: 'cardController'
	}
}];

directives.jppeoplegoingicon = [function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'app/modules/activities/components/cards/peoplegoingicon.tmpl.html',
		scope: {
			maxitems: "=",
			maxextras: "=",
			users: "="
			//userlist: "&userList"
		},
		link: function($scope, element, attrs) {
			function init(){
				if ($scope.users.length > $scope.maxitems-1) {
					$scope.showExtra = true;
					$scope.extraList = [];
					$scope.maxShownUsers = $scope.maxitems -1; // make space for the +X
					var start = $scope.users.length - ($scope.maxitems - 1) -1;
					for (var i = start; i < $scope.users.length; i++) {
						$scope.extraList.push($scope.users[i]);
					}
					$scope.displayedExtras = "";

					$scope.displayedExtras = $scope.extraList[0].name;

					var extraNotListed = $scope.extraList.length - $scope.maxextras
					for (var i = 1; i < $scope.extraList.length; i++) {
						if (i >= $scope.maxextras) {
							$scope.displayedExtras += "</br>" + extraNotListed  + " other";
							if (extraNotListed > 1) {
								$scope.displayedExtras += "s";
							}
							break;
						} else {
							$scope.displayedExtras += "</br>"
							$scope.displayedExtras += $scope.extraList[i].name;
						}
					}
				} else {
					$scope.maxShownUsers = $scope.maxitems;
					$scope.showExtra = false;
					$scope.extraList = [];
				}
			}
			init();
		}
	}
}];

mod.controller(controllers);
mod.factory(factories);
mod.directive(directives);