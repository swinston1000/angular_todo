angular.module("myApp", ['auth0.lockPasswordless', 'hmTouchEvents', 'ngResource', 'auth0.lock', 'angular-jwt', 'ui.router', 'angular-fastclick'])
    .config(config);


function config($httpProvider, lockProvider, jwtOptionsProvider, lockPasswordlessProvider) {

    // Configuration for angular-jwt
    jwtOptionsProvider.config({
        tokenGetter: function(options) {

            if (options && options.url.substr(options.url.length - 5) == '.html') {
                return null;
            }
            return localStorage.getItem('to_do_id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/'
    });

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
        options: {
            auth: {
                params: {
                    scope: 'openid email'
                }
            },
            socialButtonStyle: 'small'
        }
    });

    lockPasswordlessProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com'
    });

    $httpProvider.interceptors.push('jwtInterceptor');
}
