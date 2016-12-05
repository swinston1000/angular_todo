'use strict';

angular
    .module('myApp')
    .service('authService', authService);

function authService($q, lock, authManager) {

    var deferredProfile = $q.defer();

    function login() {
        lock.show();
    }

    function logout() {
        localStorage.removeItem('to_do_id_token');
        authManager.unauthenticate();
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
        lock.on('authenticated', function(authResult) {

            lock.getProfile(authResult.idToken, function(error, profile) {
                if (error) {
                    return console.log(error);
                }
                //localStorage.setItem('to_do_profile', JSON.stringify(profile));
                deferredProfile.resolve(profile);
            });

            localStorage.setItem('to_do_id_token', authResult.idToken);
            authManager.authenticate();

        });

    }

    return {
        login: login,
        logout: logout,
        registerAuthenticationListener: registerAuthenticationListener
    }
}
