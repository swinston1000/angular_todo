angular.module('myApp').directive('navBar', function() {
    return {
        restrict: 'E',
        controller: 'LoginController',
        controllerAs: 'loginCtrl',
        bindToController: true,
        templateUrl: '/components/navbar/navbar.template.html'
    };
});
