angular.module('myApp').directive('navBar', function() {
    return {
        restrict: 'E',
        controller: 'NavbarController',
        controllerAs: 'nbCtrl',
        bindToController: true,
        templateUrl: '/components/navbar/navbar.template.html'
    };
});

angular.module('myApp').directive('autoCollapse', function() {
    return {
        restrict: 'A',
        controller: 'NavbarController',
        link: function(scope, elem, attrs, nbCtrl) {
            elem.on('focusout', function() {
                setTimeout(function() {
                    nbCtrl.isNavCollapsed = true;
                }, 0)
            });
        }
    };
});
