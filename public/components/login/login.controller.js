'use strict';

angular
    .module('myApp')
    .controller('LoginController', LoginController);

function LoginController(authService) {

    var vm = this;

    vm.authService = authService;
}
