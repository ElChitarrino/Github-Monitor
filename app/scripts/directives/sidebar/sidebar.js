'use strict';


angular.module('ossGithubSuccess')
  .directive('sidebar',['$location', function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, $http, $timeout, $location, $rootScope, projectProvider, projectService){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
		
    		$scope.changeRepo = function(idPassedFromClick){
    			projectProvider.getProjects().then(function(data){
    				$scope.projects = data.data;
    				$scope.currentProject = $scope.projects[parseInt(idPassedFromClick.charAt(4))];
            projectService.currentProject.projectName = $scope.projects[parseInt(idPassedFromClick.charAt(4))].projectName;
            projectService.currentProject.id = $scope.currentProject.id;
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
