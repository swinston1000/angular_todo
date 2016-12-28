angular.module('myApp').component('fixedFooter', {
    controller: 'FooterController',
    require: {
        mainCtrl: '^homeComponent'
    },
    templateUrl: '/components/footer/footer.template.html'
});
