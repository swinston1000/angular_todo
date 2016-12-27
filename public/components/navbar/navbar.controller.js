'use strict';

angular.module('myApp')
    .controller('NavbarController', function($window, authService, $stateParams) {

        this.authService = authService;

        if (screen.width < 728) {
            this.isNavCollapsed = true;
        }

        this.focus = function() {
            setTimeout(function() {
                var element = $window.document.getElementById("navbar-collapse");
                if (element) {
                    element.focus();
                }
            }, 0);
        };

    });
