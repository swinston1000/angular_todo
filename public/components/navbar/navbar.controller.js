'use strict';

angular.module('myApp')
    .controller('NavbarController', function(authService, $stateParams) {

        this.authService = authService;

        if (screen.width < 728) {
            this.isNavCollapsed = true;
        }
    });
