angular.module('myApp').directive('dropdownDirection', function($window) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.on('click', function() {
                var dropmenu = angular.element(elem[0].nextElementSibling);
                var parent = angular.element(elem[0].parentElement);

                dropmenu.addClass('hide_dd');
                parent.removeClass('dropup');

                //Determine whether bottom of menu will be below window at current scroll position
                if (40 + dropmenu[0].getBoundingClientRect().top + dropmenu[0].offsetHeight > $window.innerHeight) {
                    parent.addClass('dropup');
                }

                dropmenu.removeClass("hide_dd");
            });
        }
    };
});


// awesome solution to auto-focus from:
// http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
angular.module("myApp").directive('todoFocusMe', function($timeout) {
    return {
        scope: { trigger: '=todoFocusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === true) {
                    $timeout(function() {
                        element[0].focus();
                        scope.trigger = false;
                    }, 0);
                }
            });
        }
    };
});

angular.module("myApp").directive('todoEscape', function() {
    'use strict';
    var ESCAPE_KEY = 27;
    return function(scope, elem, attrs) {
        elem.bind('keydown', function(event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.todoEscape);
                elem.blur(); //when the element loses focus it triggers the blur event on the DOM
            }
        });
        scope.$on('$destroy', function() {
            elem.unbind('keydown');
        });
    };
});
