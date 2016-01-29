'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar',['$location', 'projectProvider', function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, $http, $timeout, $location, projectProvider){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
		
        $scope.check = function(x){
          
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };
		
		$scope.changeRepo = function(idPassedFromClick){
			$location.path('dashboard.home'); // path not hash
			projectProvider.getProjects().then(function(data){
				$scope.projects = data.data;
				$scope.currentProject = $scope.projects[parseInt(idPassedFromClick.charAt(4))];
				angular.element(document.getElementById('repoHeader')).scope().currentProject = $scope.currentProject;
			}); 

		};
		

	
      }
    }
  }]);
