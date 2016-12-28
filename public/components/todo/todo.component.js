angular.module('myApp').component('toDo', {
    controller: 'toDoController',
    controllerAs: 'todoCtrl',
    bindings: {
        todo: '=',
    },
    templateUrl: function($element, $attrs, $window) {
        var width = $window.innerWidth; //or some other test..
        if (width <= 768) {
            return 'components/todo/todo.mobile.template.html';
        } else {
            return 'components/todo/todo.template.html'
        }
    }
});
