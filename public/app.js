angular.module("myApp", ['hmTouchEvents', 'ngResource', 'auth0.lock', 'angular-jwt', 'angular-fastclick'])
    .config(config);


function config($httpProvider, lockProvider, jwtOptionsProvider) {


    // Configuration for angular-jwt
    jwtOptionsProvider.config({
        tokenGetter: function(options) {
            if (options && options.url.substr(options.url.length - 5) == '.html') {
                return null;
            } else return localStorage.getItem('to_do_id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/'

    });


    $httpProvider.interceptors.push('jwtInterceptor');

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
        options: {
            auth: {
                params: {
                    scope: 'openid email'
                },
                //redirect: false
            },
            socialButtonStyle: 'small'
        }
    });


}
