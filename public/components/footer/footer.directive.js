angular.module('myApp').directive('fixedFooter', function() {
    return {
        restrict: 'E',
        controller: 'FooterController',
        controllerAs: 'fCtrl',
        bindToController: true,
        templateUrl: '/components/footer/footer.template.html'
    };
});
