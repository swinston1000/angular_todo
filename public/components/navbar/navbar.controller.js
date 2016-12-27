'use strict';

angular.module('myApp')
    .controller('NavbarController', function($timeout, $window, authService, $stateParams) {

        var nbCtrl = this;
        nbCtrl.authService = authService;
        nbCtrl.isNavCollapsed = false;

        if (screen.width < 728) {
            nbCtrl.isNavCollapsed = true;
        }

        var outside = $window.document.getElementById("outside-navbar");

        nbCtrl.focus = function() {
            angular.element(outside).on("touchstart", function() {
                $timeout(function() {
                    nbCtrl.isNavCollapsed = true;
                }, 0)
            });
        };

        nbCtrl.blur = function() {
            angular.element(outside).off("touchstart")
        };

    });
