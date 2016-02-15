'use strict';

angular.module('ossGithubSuccess')
  .controller('MainCtrl', function($scope, $position, $rootScope, projectService) {
	
	var init = function(){
		projectService.getCollection().then(function(data){
			$scope.projects = data.data.projects;
		}); 
		$scope.currentProject = {};
		$scope.alreadyInit = true;
		$scope.currentProject.projectName = 'openui5';
		document.getElementById('MeasureSelector').addEventListener("change", $scope.changeMeasure);
		$scope.currentProject.page = 1;
		projectService.currentProject = $scope.currentProject;
		projectService.getOrgMembers();
	};

	$scope.getCurrentUrl = function(){
		var url = "https://api.github.com/repos/SAP/" + $scope.currentProject.projectName;
		if($scope.currentProject.projectName === "review.ninja"){
			url = "https://api.github.com/repos/reviewninja/" + $scope.currentProject.projectName;
		}
				if($scope.currentProject.projectName === "electron"){
			url = "https://api.github.com/repos/atom/" + $scope.currentProject.projectName;
		}
				if($scope.currentProject.projectName === "nw.js"){
			url = "https://api.github.com/repos/nwjs/" + $scope.currentProject.projectName;
		}
		var bla = document.getElementById('MeasureSelector');
		switch(document.getElementById('MeasureSelector').selectedIndex){
			case 0: url += "/stats/commit_activity"; $scope.currentProject.measure = "Commit Activity"; break;
			case 1: url += ("/stargazers?per_page=100?&page=" + $scope.currentProject.page); $scope.currentProject.measure = "Stargazers Activity"; break;
			case 2: url += ("/forks?per_page=100&sort=oldest&page=" + $scope.currentProject.page); $scope.currentProject.measure = "Forks Activity"; break;
			case 3: url += "/releases"; $scope.currentProject.measure = "Releases Activity"; break;
			case 4: url += ("/contributors?per_page=100&page=" + $scope.currentProject.page); $scope.currentProject.measure = "Contributors Activity"; break;
			case 5: 
				if($scope.currentProject.pullsClosedFinished && !projectService.currentProject.pullsOpenFinished){
					url += ("/pulls?state=open?&sort=created?&per_page=100?&page=" + projectService.currentProject.page);
				}
				else /*if(projectService.currentProject.page === 1 || !projectService.currentProject.pullsClosedFinished)*/{
					url += ("/pulls?state=closed?&sort=created?&per_page=100?&page=" + projectService.currentProject.page);
				}
				$scope.currentProject.measure = "Pulls Activity"; 
				break;
			case 6: url += "/issues"; $scope.currentProject.measure = "Issues Activity"; break;
		}
		projectService.currentProject = $scope.currentProject;
		return url;
	};

	$scope.changeMeasure = function(){
		var data = $scope.getStats($scope.getCurrentUrl(), true);
	};

	$scope.getStats = function(urlLink, isInitial){
		if(isInitial){$scope.currentProject.page = 1; projectService.currentProject.page = 1;}
		function handleResult(result){
			$scope.currentProject = projectService.currentProject;
			switch($scope.currentProject.measure){
				case "Commit Activity":
					$scope.handleCommits(result);
					break;
				case "Stargazers Activity":
					$scope.handleStars(result);
					break;
				case "Forks Activity":
					$scope.handleForks(result);
					break;
				case "Releases Activity":
					break;
				case "Contributors Activity":
					$scope.handleContributors(result);
					break;
				case "Pulls Activity":
					$scope.handlePulls(result);
					break;
				case "Issues Activity":
					$scope.handleIssues(result);
					break;
			}
			$scope.getSumCurrentMeasure($scope.currentProject.measure);
		};

		//AJAX request, fetches the desired data through the Github API and invokes the handleResult() method
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
				handleResult(data);
			},
			type: "GET"
		});
	};

	$scope.handleCommits = function(result){
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
		// $scope.updateBarChart($scope.currentProject.months, $scope.currentProject.commits);
	};

	$scope.handleStars = function(result){
		if(projectService.currentProject.page === 1){
			$scope.currentProject.years = new Array(0);
			$scope.currentProject.stars = new Array(0);
			$scope.currentProject.starDates = new Array(0);
		}
		for(var i = 0; i < result.length; i++){
			var date = new Date(result[i].starred_at);
			for(var k = 0; k <= $scope.currentProject.starDates.length; k++){
				if(k === ($scope.currentProject.starDates.length - 1) && k !== 0){break;}
				if($scope.currentProject.starDates[k] === date && k !== 0){
					projectService.currentProject.isRepetitive = true;
					break;
				}
				else{
					$scope.currentProject.starDates.push(date);
					break;
				}
			}
			if(projectService.currentProject.isRepetitive){
				break;
			}
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
		if(result.length === 0 || projectService.currentProject.isRepetitive){
			if($scope.currentProject.years !== undefined){
				// $scope.updateLineChart($scope.currentProject.years, $scope.currentProject.stars);
				$scope.updateBarChart($scope.currentProject.years, $scope.currentProject.stars);
				$scope.currentProject.starDates = new Array(0);
			}
			$scope.currentProject.page = 1;
			projectService.currentProject.page = 1;
			return;
		}
		else{
			$scope.currentProject.page++;
			$scope.getStats($scope.getCurrentUrl(), false);
			return;
		}
	};

	$scope.handleForks = function(result){
		if(projectService.currentProject.page === 1){
			$scope.currentProject.years = new Array(0);
			$scope.currentProject.forks = new Array(0);
		}
		for(var i = 0; i < result.length; i++){
			var date = new Date(result[i].created_at);
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
				// $scope.updateBarChart($scope.currentProject.years, $scope.currentProject.forks);

			}
			$scope.currentProject.page = 1;
			projectService.currentProject.page = 1;
			return;
		}
		else{
			$scope.currentProject.page++;
			$scope.getStats($scope.getCurrentUrl(), false);
			return;
		}
	};

	$scope.handlePulls = function(result){
		if($scope.currentProject.page === 1 && !projectService.currentProject.pullsClosedFinished){
			$scope.currentProject.years = new Array(0);
			$scope.currentProject.pulls = new Array(0);
			projectService.currentProject.pullsOpenFinished = false;
			projectService.currentProject.pullsClosedFinished = false;
		}
		for(var i = 0; i < result.length; i++){
			var date = new Date(result[i].created_at);
			var year = date.getYear() + 1900;
			for(var j = 0; j <= $scope.currentProject.years.length; j++){
				if(year === $scope.currentProject.years[j]){
					$scope.currentProject.pulls[j] += 1;
					break;
				}
				else{
					if(j === $scope.currentProject.years.length){
						$scope.currentProject.years.push(year);
						$scope.currentProject.pulls[$scope.currentProject.years.length-1] = 1;
						break;
					}
				}
			}
		}
		projectService.currentProject.years = $scope.currentProject.years;
		projectService.currentProject.pulls = $scope.currentProject.pulls;
		if(result.length === 0 && !projectService.currentProject.pullsClosedFinished){
			projectService.currentProject.page = 1;
			projectService.currentProject.pullsClosedFinished = true;
			$scope.getStats($scope.getCurrentUrl(), false);
		}
		else if(result.length === 0 && !projectService.currentProject.pullsOpenFinished){
			projectService.currentProject.page =1;
			$scope.currentProject.page = 1;
			projectService.currentProject.pullsOpenFinished = true;
			if($scope.currentProject.years !== undefined){
				$scope.updateLineChart($scope.currentProject.years, $scope.currentProject.pulls);
				// $scope.updateBarChart($scope.currentProject.years, $scope.currentProject.pulls);
				return;
			}

		}
		else{
			projectService.currentProject.page++;
			$scope.getStats($scope.getCurrentUrl(), false);
			return;
		}
	};

	$scope.handleContributors = function(result){
		if(projectService.currentProject.page === 1){
			$scope.currentProject.contributors = new Array(0);
			$scope.SAPMembers = new Array(0);
			projectService.currentProject.internalContributors = 0;
			projectService.currentProject.externalContributors = 0;
		}
		for(var i = 0; i < result.length; i++){
			$scope.currentProject.contributors.push({"name": result[i].login, "contributions": result[i].contributions});
			for(var j = 0; j < $rootScope.orgMembers.length; j++){
				if(result[i].login === $rootScope.orgMembers[j]){
					projectService.currentProject.internalContributors += 1;
					break;
				}
				if((j === $rootScope.orgMembers.length - 1)){
					projectService.currentProject.externalContributors += 1;
				}
			}
		}
		$scope.updateDoughnutChart($scope.currentProject.contributors, $rootScope.orgMembers);
	};

	$scope.handleIssues = function(result){

	};

	$scope.updateDoughnutChart = function(contributors, orgMembers){
		document.getElementById("lineDiv").style.display= "none";
		document.getElementById("barDiv").style.display= "none";
		document.getElementById("doughnutDiv").style.display= "block";
		if(projectService.doughnutChart){
			projectService.doughnutChart.removeData();
			projectService.doughnutChart.datasets = null;
		}
		else{
			var doughnutChart = {};
		}
		var canvas = document.getElementById('doughnut'),
		    ctx = canvas.getContext('2d'),
		      datasets =  [
		          {
		          	value: projectService.currentProject.internalContributors,
		          	color: "#F7464A",
		          	highlight: "#FF5A5E",
		          	label: "SAP Contributors"
		          },
		          {
		          	value: projectService.currentProject.externalContributors,
		          	color: "#46BFBD",
		          	highlight: "#5AD3D1",
		          	label: "External contributors"
		          }
		      ];


		// Reduce the animation steps for demo clarity.
		doughnutChart = new Chart(ctx).Doughnut(datasets, {legend: true, legendTemplat: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"});
		projectService.doughnutChart = doughnutChart;
	};

	$scope.updateLineChart = function(chartLabels, chartData){
		document.getElementById("lineDiv").style.display= "block";
		document.getElementById("barDiv").style.display= "none";
		document.getElementById("doughnutDiv").style.display= "none";
		if(projectService.lineChart){
			projectService.lineChart.removeData();
			projectService.lineChart.datasets = null;

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
	};

	$scope.updateBarChart = function(chartLabels, chartData){
		document.getElementById("lineDiv").style.display= "none";
		document.getElementById("barDiv").style.display= "block";
		document.getElementById("doughnutDiv").style.display= "none";
		if(projectService.barChart){
			projectService.barChart.removeData();
			projectService.barChart.datasets = null;

		}
		else{
			var barChart = {};
		}
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
		barChart = new Chart(ctx).Bar(startingData);
		projectService.barChart = barChart;
	};

	$scope.getSumCurrentMeasure = function(cM){
		$scope.currentProject.sumCurrentMeasure = 0;
		switch(cM){
			case "Commit Activity":
				for(var i = 0; i < projectService.currentProject.commits.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.commits[i];
				}
				break;
			case "Stargazers Activity":
				for(var i = 0; i < projectService.currentProject.stars.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.stars[i];
				}
				break;
			case "Forks Activity":
				for(var i = 0; i < projectService.currentProject.forks.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.forks[i];
				}
				break;
			case "Releases Activity":
				for(var i = 0; i < projectService.currentProject.releases.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.releases[i];
				}
				break;
			case "Contributors Activity":
				for(var i = 0; i < projectService.currentProject.contributors.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.contributors[i].contributions;
				}
				break;
			case "Pulls Activity":
				for(var i = 0; i < projectService.currentProject.pulls.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.pulls[i];
				}
				break;
			case "Issues Activity":
				for(var i = 0; i < projectService.currentProject.issues.length; i++){
					$scope.currentProject.sumCurrentMeasure += projectService.currentProject.issues[i];
				}
				break;
		}
		$scope.$apply();
	};

	$rootScope.$on("CallChangeMeasure", function(projectName){
		$scope.currentProject.projectName = projectService.currentProject.projectName;
        $scope.changeMeasure();
    });

	init();
  });
