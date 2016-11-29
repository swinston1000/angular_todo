angular.module("myApp", ['ngStorage', 'ngResource', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);


function config($stateProvider, lockProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'index.html'
        })
        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'components/login/login.html',
            controllerAs: 'vm'
        });

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com'
    });

    $urlRouterProvider.otherwise('/home');
}
