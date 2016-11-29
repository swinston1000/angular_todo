angular.module("myApp", ['ngStorage', 'ngResource', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);


function config($stateProvider, lockProvider, $urlRouterProvider) {

    $stateProvider
        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'components/login/login.html',
            controllerAs: 'vm'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        });

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com'
    });

    $urlRouterProvider.otherwise('/home');
}
