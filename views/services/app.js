/* The seagull angular application */
var dc-web = angular.module('dc-web', [
  'ngRoute',
  'seagullControllers',
  'ngCookies', // To save perference of i18n language
  'pascalprecht.translate'
]);
dc-web.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/images', {
        templateUrl: '/dc-web/views/services/images.html',
        controller: 'ImagesController'
      });
  }]
);
