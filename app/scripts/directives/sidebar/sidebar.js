'use strict';


angular.module('ossGithubSuccess')
  .directive('sidebar',['$location', function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, $http, $timeout, $location, $rootScope, projectService){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
		
    		$scope.changeRepo = function(idPassedFromClick){
    			projectService.getCollection().then(function(data){
    				$scope.projects = data.data.projects;
    				$scope.currentProject = $scope.projects[parseInt(idPassedFromClick.substr(4))];
            projectService.currentProject = {};
            projectService.currentProject.projectName = $scope.currentProject.projectName;
            projectService.currentProject.projectID = idPassedFromClick;
            projectService.currentProject.pullsOpenFinished = false;
            projectService.currentProject.pullClosedFinished = false;
            $location.path('dashboard.home'); // path not hash
            $rootScope.$emit('CallChangeMeasure', {});
    			}); 
    		};
        var init = function(){
          $scope.changeRepo('repo0');
        };
        init();
      }
    }
  }]);
