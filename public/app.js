angular.module("myApp", ['angularViewportWatch', 'ui.bootstrap', 'ui.router', 'hmTouchEvents', 'ngAnimate', 'auth0.lock', 'auth0.auth0', 'angular-jwt', 'angular-fastclick'])
    .config(config)
    .component('homeComponent', {
        // bindings: {
        //     todos: "<"
        // },
        controller: 'mainController',
        controllerAs: 'mainCtrl',
        templateUrl: 'components/main/main.template.html',
    });

function config($animateProvider, $locationProvider, $urlRouterProvider, $stateProvider, $httpProvider, lockProvider, jwtOptionsProvider, angularAuth0Provider) {


    $animateProvider.classNameFilter(/animate/);

    $locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');

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

    $stateProvider
        .state('home', {
            url: '/',
            template: '<home-component></home-component>',
            //template: '<home-component todos="homeRouteCtrl.todos"></home-component>',
            controllerAs: "homeRouteCtrl",
            // controller: function(todos) {
            //     this.todos = todos;
            // },
            resolve: {
                todos: ['toDoService', function(toDoService) {
                    // return toDoService.getTodos().then(function(data) {
                    //     return data
                    // });
                    return toDoService.getTodos()
                }]
            }
        })

    $urlRouterProvider.otherwise('/');

    angularAuth0Provider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
    })

    $httpProvider.interceptors.push('jwtInterceptor');

    lockProvider.init({
        clientID: 'F3kTtFLJVyWUqdcqoW0eWHn7dH9rmOtJ',
        domain: 'app60017704.eu.auth0.com',
        options: {
            auth: {
                params: {
                    scope: 'openid email user_id'
                },
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
