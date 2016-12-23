angular.module('myApp').directive('navBar', function() {
    return {
        restrict: 'E',
        controller: 'NavbarController',
        controllerAs: 'nbCtrl',
        bindToController: true,
        templateUrl: '/components/navbar/navbar.template.html'
    };
});
