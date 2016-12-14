'use strict';

angular
    .module('myApp')
    .controller('LoginController', LoginController);

function LoginController(authService, $stateParams) {

    //console.log($stateParams);

    var vm = this;
    vm.authService = authService;
}
