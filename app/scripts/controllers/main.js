'use strict';

angular.module('ossGithubSuccess')
  .controller('MainCtrl', function($scope, $position, $rootScope, projectProvider, projectService) {
	
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
		// document.getElementById('Selector').addEventListener("click", $scope.changeMeasure);
		$scope.currentProject.page = 1;
		// $scope.getStats($scope.getCurrentUrl());
		projectService.currentProject = $scope.currentProject;
	};

	$scope.getCurrentUrl = function(){
		var url = "https://api.github.com/repos/SAP/" + $scope.currentProject.projectName;
		if($scope.currentProject.projectName === "review.ninja"){
			url = "https://api.github.com/repos/reviewninja/" + $scope.currentProject.projectName;
		}
		var bla = document.getElementById('Selector');
		switch(document.getElementById('Selector').selectedIndex){
			case 0: url += "/stats/commit_activity"; $scope.currentProject.measure = "commit_activity"; break;
			case 1: url += ("/stargazers?per_page=100?&page=" + $scope.currentProject.page); $scope.currentProject.measure = "stargazers"; break;
			case 2: url += "/forks"; $scope.currentProject.measure = "forks"; break;
			case 3: url += "/releases"; $scope.currentProject.measure = "releases"; break;
			case 4: url += "/contributors"; $scope.currentProject.measure = "contributors"; break;
			case 5: url += "/pulls"; $scope.currentProject.measure = "pulls"; break;
			case 6: url += "/issues"; $scope.currentProject.measure = "issues"; break;
		}
		projectService.currentProject = $scope.currentProject;
		return url;
	};

	$scope.changeMeasure = function(){
		var data = $scope.getStats($scope.getCurrentUrl());
	};

	$scope.changeChart = function(measure){
		console.log("Hello" + measure);
	};

	$scope.getStats = function(urlLink){
		function returnResult(result){
			var data = [], labels = [];
			$scope.currentProject = projectService.currentProject;
			switch($scope.currentProject.measure){
				case "commit_activity":
					$scope.currentProject.months = new Array(0);
					$scope.currentProject.commits = new Array(0);
					for(var i = 0; i < result.length; i++){
						var date = new Date(result[i].week * 1000);
						var month = date.getMonth();
						switch(month){
							case 0: month = "January"; break;
							case 1: month = "February"; break;
							case 2: month = "March"; break;
							case 3: month = "April"; break;
							case 4: month = "May"; break;
							case 5: month = "June"; break;
							case 6: month = "July"; break;
							case 7: month = "August"; break;
							case 8: month = "September"; break;
							case 9: month = "October"; break;
							case 10: month ="November"; break;
							case 11: month = "December"; break;
						}
						var year = date.getYear() + 1900;
						for(var j = 0; j <= $scope.currentProject.months.length; j++){
							if(month === $scope.currentProject.months[j]){
								$scope.currentProject.commits[j] += result[i].total;
								break;
							}
							else{
								if(j === $scope.currentProject.months.length){
									$scope.currentProject.months.push(month);
									$scope.currentProject.commits[$scope.currentProject.months.length-1] = result[i].total;
									break;
								}
							}
						}
					}
					$scope.updateLineChart($scope.currentProject.months, $scope.currentProject.commits);
					$scope.updateBarChart($scope.currentProject.months, $scope.currentProject.commits);
					break;
				case "stargazers":
					if($scope.currentProject.page === 1){
						$scope.currentProject.years = new Array(0);
						$scope.currentProject.stars = new Array(0);
					}
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
					projectService.currentProject.years = $scope.currentProject.years;
					projectService.currentProject.stars = $scope.currentProject.stars;
					if(result.length === 0){
						if($scope.currentProject.years !== undefined){
							$scope.updateLineChart($scope.currentProject.years, $scope.currentProject.stars);
						}
						$scope.currentProject.page = 1;
						projectService.currentProject.page = 1;
						break;
					}
					else{
						$scope.currentProject.page++;
						$scope.getStats($scope.getCurrentUrl());
						break;
					}
					break;
				case "forks":
					if($scope.currentProject.page === 1){
							$scope.currentProject.years = new Array(0);
							$scope.currentProject.forks = new Array(0);
						}
						for(var i = 0; i < result.length; i++){
							var date = new Date(result[i].starred_at);
							var year = date.getYear() + 1900;
							for(var j = 0; j <= $scope.currentProject.years.length; j++){
								if(year === $scope.currentProject.years[j]){
									$scope.currentProject.forks[j] += 1;
									break;
								}
								else{
									if(j === $scope.currentProject.years.length){
										$scope.currentProject.years.push(year);
										$scope.currentProject.forks[$scope.currentProject.years.length-1] = 1;
										break;
									}
								}
							}
						}
						projectService.currentProject.years = $scope.currentProject.years;
						projectService.currentProject.forks = $scope.currentProject.forks;
						if(result.length === 0){
							if($scope.currentProject.years !== undefined){
								$scope.updateLineChart($scope.currentProject.years, $scope.currentProject.forks);
							}
							$scope.currentProject.page = 1;
							projectService.currentProject.page = 1;
							break;
						}
						else{
							$scope.currentProject.page++;
							$scope.getStats($scope.getCurrentUrl());
							break;
						}
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

		//AJAX request, fetches the desired data through the Github API and invokes the returnResult() method
		//which processes the data further and builds new charts
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

	$scope.updateLineChart = function(chartLabels, chartData){
		if(projectService.lineChart){
			projectService.lineChart.removeData();

		}
		else{
			var lineChart = {};
		}
		var canvas = document.getElementById('line'),
		    ctx = canvas.getContext('2d'),
		    startingData = {
		      labels: chartLabels,
		      datasets: [
		          {
	                fillColor : "rgba(151,187,205,0.5)",
	                strokeColor : "rgba(151,187,205,1)",
	                pointColor : "rgba(151,187,205,1)",
	                pointStrokeColor : "#fff",
		            data: chartData
		          }
		      ],
		      legend: true
		    };
		// Reduce the animation steps for demo clarity.
		lineChart = new Chart(ctx).Line(startingData);
		projectService.lineChart = lineChart;
		// ctx.canvas.width = 500;
		// myLiveChart = new Chart(ctx).Line(startingData);
	};

	$scope.updateBarChart = function(chartLabels, chartData){
		var canvas = document.getElementById('bar'),
		    ctx = canvas.getContext('2d'),
		    startingData = {
		      labels: chartLabels,
		      datasets: [
		          {
	                fillColor : "rgba(151,187,205,0.5)",
	                strokeColor : "rgba(151,187,205,1)",
	                pointColor : "rgba(151,187,205,1)",
	                pointStrokeColor : "#fff",
		            data: chartData
		          }
		      ],
		      legend: true
		    };
		// Reduce the animation steps for demo clarity.
		var myLiveChart = new Chart(ctx).Bar(startingData);
		// ctx.canvas.width = 500;
		// myLiveChart = new Chart(ctx).Line(startingData);
	};

	$rootScope.$on("CallChangeMeasure", function(projectName){
		$scope.currentProject.projectName = projectService.currentProject.projectName;
        $scope.changeMeasure();
    });

	init();
  });
