angular.module("myApp").directive('scrollOnClick', function($window) {
    'use strict';
    return function(scope, elem, attrs) {
        elem.on('click', function(event) {
            $window.scrollTo(0, 1)
        });
    };
});
