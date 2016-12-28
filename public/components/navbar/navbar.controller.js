angular.module('myApp')
    .controller('NavbarController', function($timeout, $window, authService) {

        var nbCtrl = this;
        nbCtrl.authService = authService;
        nbCtrl.isNavCollapsed = false;

        if (screen.width < 728) {
            nbCtrl.isNavCollapsed = true;
        }

        nbCtrl.focus = function() {
            var outside = $window.document.getElementById("outside-navbar");
            angular.element(outside).on("touchstart", function() {
                $timeout(function() {
                    nbCtrl.isNavCollapsed = true;
                }, 0)
            });
        };

        nbCtrl.blur = function() {
            var outside = $window.document.getElementById("outside-navbar");
            angular.element(outside).off("touchstart")
        };
    });
