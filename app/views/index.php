<!DOCTYPE HTML>
<html>
  <head>
	  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	  <meta charset="utf-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta name="description" content="">
	  <meta name="author" content="">
	  <link rel="shortcut icon" href="app/img/favicon.ico">
	  
	  <title>justPlay</title>


	  <!-- Core CSS -->
	  <link href="app/lib/bootstrap-3.1.0/dist/css/bootstrap.css" rel="stylesheet">
	  <link href="app/fonts/font-awesome/css/font-awesome.css" rel="stylesheet">  
	  <link href="app/css/playground.css" rel="stylesheet"> 
	  <link href="app/css/activity.css" rel="stylesheet"> 
	  <link href="bower_components/angular-growl-v2/build/angular-growl.css" rel="stylesheet">
	  <link href="bower_components/angular-xeditable/dist/css/xeditable.css" rel="stylesheet">
  </head>

  <body ng-app="app">
  	<div growl></div>
		<div class='body-view' ui-view></div>

		<!-- NON ANGULAR -->
	  <script src="app/js/non-angular/polyfills.js"></script>
	  <script src="bower_components/moment/moment.js"></script>
	  <script src="app/js/non-angular/moment.config.js"></script>
		<script src="bower_components/moment-timezone/moment-timezone.js"></script>
		<script src="app/lib/moment-timezone-data.js"></script>	
		<script src="bower_components/validator.js/dist/validator.js"></script>

	  <!-- BOWER DEPENDENCIES -->
	  <script src="bower_components/jquery/dist/jquery.min.js"></script>
	  <script src="bower_components/angular/angular.js"></script>
	  <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
	  <script src="bower_components/angular-resource/angular-resource.js"></script>
	  <script src="bower_components/angular-moment/angular-moment.js"></script>
	  <script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
	  <script src="bower_components/angular-growl-v2/build/angular-growl.js"></script>
		<script src="bower_components/angular-xeditable/dist/js/xeditable.js"></script>
		<script src="bower_components/lodash/dist/lodash.js"></script>
		<script src="bower_components/restangular/src/restangular.js"></script>
		<script src="bower_components/angulartics/dist/angulartics.min.js"></script>
		<script src="bower_components/angulartics/dist/angulartics-ga.min.js"></script>


		<!-- CUSTOM SCRIPTS -->
	  <script src="app/lib/bootstrap-3.1.0/dist/js/bootstrap.min.js"></script>
	  <script src="app/lib/angular-ui-bootstrap/ui-bootstrap-tpls-0.10.0.js"></script>
	  <link href="app/lib/angular-multiselect-master/src/style.css" rel="stylesheet" type="text/css" media="all"  />
	  <script src="app/lib/angular-multiselect-master/src/multiselect.js"></script> 
		<script src="app/lib/validator/validator-service.js"></script>
	  <!-- Modules -->

		<!-- Utilities -->
		<script src="app/utilities/flashService.js"></script>
		<script src="app/utilities/http.js"></script>
		<script src="app/utilities/authentication.js"></script>
		<script src="app/utilities/utilities.js"></script>
		<script src="app/utilities/friends/friendModule.js"></script>
		<script src="app/utilities/schedule/scheduleModule.js"></script>		
		<script src="app/modules/masterController.js"></script>

		<!-- justPlay user Module -->
	  <script src="app/modules/users/userModule.js"></script>
	  <script src="app/modules/social/social.js"></script>
		<script src="app/modules/profile/profile.js"></script>

	  <!-- justPlay activity Modules -->
	  <script src="app/modules/activities/common/participantModule.js"></script>
	  <script src="app/modules/activities/common/friendModule.js"></script>
	  <script src="app/modules/activities/common/activityModule.js"></script>
	  <script src="app/modules/activities/common/commentModule.js"></script>
	  <script src="app/modules/activities/components/filters/filterModule.js"></script>
	  <script src="app/modules/activities/components/searchbar/searchbar.js"></script>
	  <script src="app/modules/activities/components/cards/cardModule.js"></script>
	  <script src="app/modules/activities/components/datepicker/dateModule.js"></script>
	  <script src="app/modules/activities/components/activitymanager/activityManagerModule.js"></script>

		<!-- justPlay activity create module -->
		<script src="app/modules/activities/components/createform/createform.js"></script>

		<!-- justplay activities main page -->
		<script src="app/modules/activities/activities.js"></script>

		<!-- justplay notifications module -->
	  <script src="app/modules/notifications/notificationsModule.js"></script>

	  <!-- justPlay login/signup Modules -->
	  <script type="text/javascript" src="app/modules/login/login.js"></script>
		<script type="text/javascript" src="app/modules/signup/signup.js"></script>
		
		<!-- justplay main page -->
		<script src="app/modules/config.js"></script>
	  <script src="app/modules/app.js"></script>

		<!-- CSRF Token -->
	  <script>
	  	angular.module("jp.http").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');
	  </script>

	  <!-- Google Analytics -->
	  <script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-54553612-1', 'auto');
		  ga('require', 'displayfeatures');

		</script>
	</body>
</html>