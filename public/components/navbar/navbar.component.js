angular.module('myApp').component('navBar', {
    controller: 'NavbarController',
    require: {
        mainCtrl: '^homeComponent'
    },
    templateUrl: '/components/navbar/navbar.template.html'
});
