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

	var init = function(){
		projectProvider.getProjects().then(function(data){
			$scope.projects = data.data;
		}); 
		$scope.alreadyInit = true;
		$scope.currentProject.projectName = 'openui5';
		document.getElementById('Selector').addEventListener("change", $scope.changeMeasure);
		$scope.currentProject.page = 28;
		$scope.getStats($scope.getCurrentUrl());
	};

	$scope.getCurrentUrl = function(){
		var url = "https://api.github.com/repos/SAP/" + $scope.currentProject.projectName;
		$scope.currentProject.years = new Array(0);
		$scope.currentProject.stars = new Array(0);
		switch(document.getElementById('Selector').selectedIndex){
			case 0: url += "/stats/commit_activity"; $scope.currentProject.measure = "commit_activity"; break;
			case 1: url += ("/stargazers?per_page=100?&page=" + $scope.currentProject.page); $scope.currentProject.measure = "stargazers"; break;
			case 2: url += "/forks"; $scope.currentProject.measure = "forks"; break;
			case 3: url += "/releases"; $scope.currentProject.measure = "releases"; break;
			case 4: url += "/contributors"; $scope.currentProject.measure = "contributors"; break;
			case 5: url += "/pulls"; $scope.currentProject.measure = "pulls"; break;
			case 6: url += "/issues"; $scope.currentProject.measure = "issues"; break;
		}
		return url;
	};

	$scope.changeMeasure = function(){
		var data = $scope.getStats($scope.getCurrentUrl());
		
	};

	$scope.changeChart = function(measure){
		console.log("Hello" + measure);
	};

	$scope.getStats = function(urlLink){
	  	var result = [], i = 0;
		function returnResult(result){
			var data = [], labels = [];
			// $scope.currentProject.data = result;
			switch($scope.currentProject.measure){
				case "commit_activity":
					for(var i = 0; i < result.length; i++){
						var date = new Date("" + result[i].week);
						var month = date.getMonth();
						var year = date.getYear();
						
					}
					break;
				case "stargazers":
					for(var i = 0; i < result.length; i++){
						var date = new Date(result[i].starred_at);
						var year = date.getYear() + 1900;
						for(var j = 0; j <= $scope.currentProject.years.length; j++){
							if(year === $scope.currentProject.years[j]){
								$scope.currentProject.stars[j] += 1;
								break;
							}
							else{
								if(j === $scope.currentProject.years.length){
									$scope.currentProject.years.push(year);
									$scope.currentProject.stars[$scope.currentProject.years.length-1] = 1;
									break;
								}
							}
						}
					}
					if(result !== []){
						// $scope.currentProject.page++;
						// $scope.getStats($scope.getCurrentUrl());
					}
					else{
						break;
					}
					break;
				case "forks":
					break;
				case "releases":
					break;
				case "contributors":
					break;
				case "pulls":
					break;
				case "issues":
					break;
			}
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
