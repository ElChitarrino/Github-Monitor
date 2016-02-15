'use strict';

var myApp = angular
  .module('ossGithubSuccess', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
  ])
  .service('projectService', function($http, $rootScope){
    this.currentProject = null;
    this.orgMembers = new Array(0);
    this.getCollection = function(){
      var response = $http.get('models/dbModel.json').then(function(response) {
        return response;
      }); 
      return response;
    },
    this.setCollection = function(collectionNew){
      $http.post('http://localhost:8000/api/database', collectionNew).then(function(successRes){
        console.log(successRes);
      },function(errorRes){
        console.log(errorRes);
      });
    },
    this.getOrgMembers = function(){
      this.handleResult = function(result){
        var orgMembers = new Array(0);
        for(var i = 0; i < result.length; i++){
          orgMembers.push(result[i].login);
        }
        $rootScope.orgMembers = orgMembers;
        return orgMembers;
      };

      var that = this;
      $.ajax({
        url: "https://api.github.com/orgs/SAP/members?per_page=100",
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
          that.handleResult(data);
        },
        type: "GET"
      });
    }

  })
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'ossGithubSuccess',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'ossGithubSuccess',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'ossGithubSuccess',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
  }]);
  
// myApp.factory('projectProvider', function($http){
// 	return {
// 		getProjects: function(){
// 			var promise = $http.get('models/dbModel.json').then(function(response) {
// 				return response;
// 			}); 
//       // $http.get('http://localhost:8000/api/database').success(function(res){
//       //   console.log(res);
//       // });
// 			return promise;
// 		},
//     setScope: function(scope){
//       this.scope = scope;
//     },
//     getScope: function(){
//       return this.scope;
//     }
// 	}
// });

    