'use strict';

angular.module('myApp')
    .controller('NavbarController', function($window, authService, $stateParams) {

        this.authService = authService;

        if (screen.width < 728) {
            this.isNavCollapsed = true;
        }
    });
