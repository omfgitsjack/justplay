var project = angular.module('project', ['angularMoment'])
.factory('strategyFactory', function ()	{
		var factory = {};
		var strategies = [
			'Earliest', 'Latest',
			'Most Players', 'Least Players',
			'Most Friends', 'Least Friends'
		];
		factory.getStrategies = function () {
			return strategies;
		};
		return factory;
})
.factory('sportFactory', function() {
	var factory = {};
	// Sports should be arranged in 5s
	var sports = {
		'RacquetSports':[['Badminton', 'Tennis', 'Squash', 'Table Tennis']],
		'TeamSports':
		[
			['Basketball','Volleyball','Ultimate Frisbee', 'Soccer', 'Football'], 
			['Ice Hockey', 'Lacrosse', 'Quidditch', 'Rugby']
		]
	};
	factory.getSports = function () {
		return sports;
	};
	return factory;
})
.factory('cardFactory', function() {
	var factory = {};
	// Sports should be arranged in 5s
	var cards = [
		{
			enddate: window.moment().add({months: 1, hours: 2}), 
			startdate: window.moment().add({months: 1}), 
			skill: 3,
			activity: 'Basketball',
			location: 'Gym',
			friends: 0,
			nonfriends: 1,
			capacity: 6,
			minimumrequired: 2,
		},
		{
			enddate: window.moment().add({months: 0, hours: 4}), startdate: window.moment().add({months: 0}),
			skill: 2,
			activity: 'Tennis',
			location: 'The Valley',
			friends: 2,
			nonfriends: 4,
			capacity: 6,
			minimumrequired: 3,
		},
		{
			enddate: window.moment().add({days: 1, hours: 4}), startdate: window.moment().add({days:1, hours:2}),
			skill: 1,
			activity: 'Badminton',
			location: 'Gym',
			friends: 1,
			nonfriends: 2,
			capacity: 6,
			minimumrequired: 4,
		}
	];
	factory.getCards = function () {
		return cards;
	};
	return factory;
});


var controllers = {};

controllers.strategyController = function($scope, strategyFactory) {
	$scope.strategies = [];
	init();
	function init() {
		$scope.strategies = strategyFactory.getStrategies();
	};
	$scope.currentstrategy = $scope.strategies[0];
	$scope.setValue = function(strategy){
		$scope.currentstrategy = strategy;
	}
};

controllers.sportController = function($scope, sportFactory) {
	$scope.sports = {};
	init();
	function init() {
		$scope.sports = sportFactory.getSports();
	};
	$scope.setValue = function(sport){
		$scope.currentsport = sport;
	}
};

controllers.dateController = function($scope) {
	init();
	function init() {
		$scope.selectedDate = window.moment();
	};
};

controllers.cardsController = function($scope, cardFactory) {
	init();
	function init() {
		$scope.cards = cardFactory.getCards();
	};
};

controllers.cardController = function($scope) {
	$scope.totalparticipants;

	$scope.progressbar;
	$scope.peopleneeded;
	$scope.neededorfree;
	$scope.stars = [];
	$scope.skillDescription;
	init();
	function init() {
		$scope.totalparticipants = $scope.card.friends+$scope.card.nonfriends;
		// Determine People needed, description to show and color of progress bar
		if ($scope.totalparticipants >= $scope.card.minimumrequired) {
			$scope.progressbar = 'success';
			$scope.neededorfree = 'SLOTS FREE';
			$scope.peopleneeded = $scope.card.capacity - $scope.totalparticipants;
		} else {
			$scope.progressbar = 'warning';
			$scope.neededorfree = 'NEEDED';
			$scope.peopleneeded = $scope.card.minimumrequired - $scope.totalparticipants;
		}
		// Determine Skill Description
		if ($scope.card.skill == 1) {
			$scope.skillDescription = "Beginner";
		} else if ($scope.card.skill == 2) {
			$scope.skillDescription = "Intermediate";
		} else if ($scope.card.skill == 3) {
			$scope.skillDescription = "Advanced";
		}
		// Determine how many stars to dish out
		for (var i = 0; i < $scope.card.skill; i++) {
			$scope.stars.push(i);
		}
	};


}

project.controller(controllers);
