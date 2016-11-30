angular.module('myApp').directive('navBar', function() {
    return {
        restrict: 'E',
        controller: 'LoginController',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: '../templates/navbar.html'
    };
});
