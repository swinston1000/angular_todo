angular.module('myApp')
    .controller('NavbarController', function($timeout, $window, authService) {

        var $ctrl = this;
        $ctrl.$onInit = function() {
            $ctrl.controls = $ctrl.mainCtrl
        };

        $ctrl.authService = authService;
        $ctrl.isNavCollapsed = false;

        if (screen.width < 728) {
            $ctrl.isNavCollapsed = true;
        }

        $ctrl.focus = function() {
            var outside = $window.document.getElementById("outside-navbar");
            angular.element(outside).on("touchstart", function() {
                $timeout(function() {
                    $ctrl.isNavCollapsed = true;
                }, 0)
            });
        };

        $ctrl.blur = function() {
            var outside = $window.document.getElementById("outside-navbar");
            angular.element(outside).off("touchstart")
        };
    });
