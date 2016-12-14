'use strict';
angular
    .module('myApp')
    .service('authService', authService);


function authService($q, lock, authManager, $rootScope, angularAuth0, $stateParams) {

    var currentToken = localStorage.getItem('to_do_id_token')


    if (currentToken) {
        angularAuth0.renewIdToken(currentToken, function(err, delegationResult) {
            if (err) {
                console.log(err);
                return
            }
            //console.log(delegationResult.id_token);
            localStorage.setItem('to_do_id_token', delegationResult.id_token);
        });
    }


    var profile = JSON.parse(localStorage.getItem('to_do_profile'))
    if (profile) {
        $rootScope.user = profile.email
    }

    var deferredProfile = $q.defer();


    function login() {
        // lockPasswordless.socialOrEmailcode({
        //         connections: ["facebook", "github"],
        //         authParams: { scope: 'openid email' },
        //         socialBigButtons: false
        //     },
        //     function(error, profile, id_token) {
        //         if (error) {
        //             alert("Error: " + error);
        //             return;
        //         }
        //         localStorage.setItem('to_do_id_token', id_token);
        //         authManager.authenticate();
        //         //localStorage.setItem('profile', JSON.stringify(profile));
        //         deferredProfile.resolve(profile);
        //         lockPasswordless.close();
        //     });
        lock.show();
    }

    function messengerLogin() {

        console.log($stateParams);

        angularAuth0.login({
            callbackURL: $stateParams.redirect + '&authorization_code=' + $stateParams.auth,
            responseType: 'token',
            scope: 'openid email',
            psid: $stateParams.psid,
        });
        // var options = {
        //     auth: {
        //         params: {
        //             scope: 'openid email',
        //         },
        //     },
        // }
        // lock.show(options)
    }

    function logout() {
        localStorage.removeItem('to_do_id_token');
        localStorage.removeItem('to_do_profile');
        authManager.unauthenticate();
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
        lock.on('authenticated', function(authResult) {

            var account = authResult.idTokenPayload.sub.split('|')[0]
            account = account.substr(0, 1).toUpperCase() + account.substr(1, account.length - 1)

            if (!authResult.idTokenPayload.email) {
                return alert("Thanks for signing up. In order to use Todoosey your " + account + " account must be associated with a verified e-mail address. Please try another method of signing up.");
            } else if (!authResult.idTokenPayload.email_verified) {
                return alert("Thanks for signing up.  You have been sent an e-mail to verify your address, please do so or try another sign up method to continue.");
            }

            lock.getProfile(authResult.idToken, function(error, profile) {
                if (error) {
                    return console.log(error);
                }
                deferredProfile.resolve(profile);
                localStorage.setItem('to_do_profile', JSON.stringify(profile));
                $rootScope.user = profile.email
            });

            localStorage.setItem('to_do_id_token', authResult.idToken);
            //localStorage.setItem('to_do_refesh_token', authResult.refreshToken);

            authManager.authenticate();
        });
    }

    return {
        login: login,
        logout: logout,
        messengerLogin: messengerLogin,
        registerAuthenticationListener: registerAuthenticationListener
    }
}
