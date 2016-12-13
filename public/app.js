angular.module("myApp", ['hmTouchEvents', 'auth0.lock', 'auth0.auth0', 'angular-jwt', 'angular-fastclick'])
    .config(config);


function config($httpProvider, lockProvider, jwtOptionsProvider, angularAuth0Provider) {

    // Configuration for angular-jwt
    jwtOptionsProvider.config({
        tokenGetter: function(options) {
            if (options && options.url.substr(options.url.length - 5) == '.html') {
                return null;
            } else {
                return localStorage.getItem('to_do_id_token');
            }
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/'

    });

    angularAuth0Provider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
        // options: {
        //     auth: {
        //         params: {
        //             //scope: 'openid offline_access email'
        //             scope: 'openid email'
        //         }
        //     }
        // }
    })

    $httpProvider.interceptors.push('jwtInterceptor');

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
        options: {
            auth: {
                params: {
                    //scope: 'openid offline_access email'
                    scope: 'openid email'
                },
                //redirect: false
            },
            socialButtonStyle: 'small',
            theme: {
                logo: '/assets/ToDoList58.png',
                primaryColor: '#344454'
            },
            languageDictionary: {
                title: "Todoosey"
            },
        }
    });


}
