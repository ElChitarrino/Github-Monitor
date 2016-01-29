'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$position, projectProvider) {
	
	$scope.projects = {
		
	};	 
	  
	$scope.currentProject = {
		
	};
	
	$scope.alreadyInit = false;

	var init = function(){
		//funzt nicht, da App komplett neustartet?!
		if($scope.alreadyInit){}
		//Initialisieren des ersten Charts (Commits..)
		else{
			projectProvider.getProjects().then(function(data){
				$scope.projects = data.data;
			}); 
			$scope.alreadyInit = true;
			// $scope.currentProject.projectName = document.getElementById('repoHeader').getText();
			$scope.stargazers($scope.getCurrentUrl());
		}
	};

	$scope.getCurrentUrl = function(){
		var url = "https://api.github.com/repos/SAP/" + $scope.currentProject.projectName;
		switch(document.getElementById('Selector').selectedIndex){
			case 0: url += "/stats/commit_activity"; break;
			case 1: url += "/stargazers?per_page=100&?page=0"; break;
			case 2: url += "/forks"; break;
			case 3: url += "/releases"; break;
			case 4: url += "/contributors"; break;
			case 5: url += "/pulls"; break;
			case 6: url += "/issues"; break;
		}
		return url;
	};

	$scope.changeMeasure = function(){

	};

	$scope.stargazers = function(urlLink){
	  	var result = [], i = 0, resultX = null;
		function returnResult(result1){
			result = result1;
			$scope.currentProject.commits = result;
		};

		$.ajax({
			url: urlLink,
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader ("Authorization", "Basic RWxDaGl0YXJyaW5vOjUzYTQ1MDRlYWIyZjEzMjcwZjRhYzFhZDVkOWVjMmFjMjk1NTNmMWM");
	        },
			data: {
				format: "json"
			},
			headers: {
				Accept: "application/vnd.github.v3.star+json"
			},
			success: function(data){
				returnResult(data);
			},
			type: "GET"
		});
	};

	init();
  });
