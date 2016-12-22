angular.module("myApp").controller('toDoController', function(toDoService, mainFactory) {

    vm = this;

    vm.editing = toDoService.editing;

    vm.getBackgroundColour = mainFactory.getBackgroundColour;

    vm.getPriority = mainFactory.getPriority;

    vm.updatePriority = mainFactory.setPriority;

    vm.toggle = function(todo) {
        todo.completed = !todo.completed
        toDoService.update(todo)
    }

    vm.remove = function(todo) {
        if (confirm("Are you sure you want to delete this to-do?")) {
            toDoService.removeTodo(todo);
        }
    };

    vm.startEditing = function(todo) {
        toDoService.startEditing(todo);
    }

    vm.cancelEditing = function(todo) {
        toDoService.cancelEditing(todo);
    }

    vm.update = function(todo, event) {

        //nasty logic to stop a 'blur' happening after 'enter'
        if (event === 'blur' && vm.saveEvent === 'enter') {
            vm.saveEvent = null;
            return
        } else if (event === "enter") {
            vm.saveEvent = 'enter';
        }
        toDoService.update(todo)

    };
})
