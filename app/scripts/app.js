var myapp = angular.module('myapp', [
  'ui.router'
]).config(function(
  $stateProvider,
  $locationProvider,
  $urlRouterProvider,
  $httpProvider
) {

  $locationProvider.html5Mode({enabled: true, requireBase: false});

  // Allow CORS
  // Taken from http://better-inter.net/enabling-cors-in-angular-js/
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider

    .state('splash', {
      url: '/',
      templateUrl: '/views/splash/main.html',
      controller: 'splash'
    })

    .state('state2', {
      url: '/test',
      template: '<h1>This is another state</h1>'
    })

    ;

});
