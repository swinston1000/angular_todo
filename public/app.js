angular.module("myApp", ['ngResource', 'auth0.lock', 'angular-jwt', 'ui.router'])
    .config(config);


function config(lockProvider, jwtOptionsProvider) {

    // Configuration for angular-jwt
    jwtOptionsProvider.config({
        tokenGetter: function() {
            return localStorage.getItem('to_do_id_token');
        }
    });

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com'
    });

}
