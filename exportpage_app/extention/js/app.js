var  app = angular.module('exportpageApp', ['ngRoute'])
.run(function($rootScope) {
    $rootScope.logged = false;
});
var baseUrl = "http://exportpage_app_local"

/**** Route configuration ****/
app.config(function($routeProvider) {

	$routeProvider.when('/signup', 
	{
		templateUrl : 'sub_pages/signup.html',
		controller  : 'signup'
		
	}).when('/signin', 
	{
		templateUrl : 'sub_pages/signin.html',
		controller  : 'signin'
		
	}).when('/home', 
	{
		templateUrl : 'sub_pages/home.html',
		controller  : 'exportpage'
		
	}).otherwise(
	{
		redirectTo : '/home'
	});
});

/**** Signup Controller ****/
app.controller('signup', function signup($scope, $http, $window){
	$scope.registred = false;
	var submited = false;

	$scope.signUp = function(){
		submited = true;

		var login = $scope.login,
			password = $scope.password,
			objSignup = {};
		
		objSignup = {"login": login, "password": password};
		objSignup = JSON.stringify(objSignup);

		$http.post(baseUrl+'/signup', objSignup).
			success(function(data) {
				console.log(data)
		    	if(data.msg == "ok"){
		    		$scope.registred = !$scope.registred;
		    	}
			}
		);

	};
	$scope.isSubmited = function(){
		return submited;
	}

});

/**** Signup Controller ****/
app.controller('signin', function signin($scope, $http, $window, $rootScope){
	$scope.logged = false;
	var submited = false;

	$scope.signIn = function(){

		var login = $scope.login,
			password = $scope.password,
			objSignin = {};
		
		objSignin = {"login": login, "password": password};
		objSignin = JSON.stringify(objSignin);

		$http.post(baseUrl+'/signin', objSignin).
			success(function(data) {
				console.log(data)
		    	if(data.logged == "ok"){
		    		$scope.logged = !$scope.logged;
		    		$rootScope.logged = true;
		    		$window.location.href="#/home"
		    	}
			}
		);

	};
	$scope.isSubmited = function(){
		return submited;
	}
});

/**** home Controller ****/
app.controller('exportpage', function exportpage($scope, $http, $window, $rootScope){

	$http.get(baseUrl+'/home').
		success(function(data) {
			console.log(data);
	    	if(data.logged == "ok"){
	    		$scope.user = data.user;
	    		$rootScope.logged = true;
	    	}else{
	    		$rootScope.logged = false;
	    		$window.location.href="#/signin"
	    	}
		}
	);

});

/**** Authentication Controller ****/
app.controller('authentication', function authentication($scope, $location, $rootScope){
	
	setTimeout(function(){
		$scope.logged = $rootScope.logged;
	},1000);

	$scope.isActive = function(route) {
	    return route === $location.path();
	};
});

/**** Logout Controller ****/
app.controller('logout', function logout($scope, $http, $window){
	
	$scope.logOut = function(){
		$http.get(baseUrl+'/logout').
			success(function(data) {
				if(data.logout == 'ok'){
					$window.location.href="#/signin"
				}
			}
		);
	}

});

/**** Exportaction Controller ****/
app.controller('exportaction', function exportaction($scope, $http, $window){
	$scope.exported = false;	
	var submited = false;

	$scope.exportPage = function(){

		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		   	chrome.tabs.executeScript(null, {
				code: 'var page = document.html.innerHTML'
			});
			submited = true;
		    var url = tabs[0].url,
			    page = page,
			    objPage = {"url": url, "page": page};

		    $http.post(baseUrl+'/sendpage', objPage).
				success(function(data) {
					console.log(data)
			    	if(data.inserted == "ok"){
			    		$scope.exported = true;	
			    	}
				}
			);

		});

		$scope.isSubmited = function(){
			return submited;
		}
	}

});



