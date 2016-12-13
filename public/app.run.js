'use strict';

angular
    .module('myApp')
    .run(run);

run.$inject = ['$rootScope', 'authService', 'lock', 'authManager'];

function run($rootScope, authService, lock, authManager) {

    // $rootScope.$on('tokenHasExpired', function() {
    //     alert('Your session has expired! Please log in again.');
    // });

    // Put the authService on $rootScope so its methods
    // can be accessed from the nav bar
    $rootScope.authService = authService;

    // Use the authanager from angular-jwt to check for
    // the user's authentication state when the page is
    // refreshed and maintain authentication
    authManager.checkAuthOnRefresh();


    // Register the authentication listener that is
    // set up in auth.service.js
    authService.registerAuthenticationListener();

}
