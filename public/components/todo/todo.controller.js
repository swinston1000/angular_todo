angular.module("myApp").controller('toDoController', function(toDoService, mainFactory) {

    _toDoCtrl = this;

    _toDoCtrl.editing = toDoService.editing;

    _toDoCtrl.getBackgroundColour = mainFactory.getBackgroundColour;

    _toDoCtrl.updatePriority = mainFactory.setPriority;

    _toDoCtrl.toggle = function(todo) {
        todo.completed = !todo.completed
        toDoService.update(todo)
    }

    _toDoCtrl.remove = function(todo) {
        if (confirm("Are you sure?")) {
            toDoService.removeTodo(todo);
        }
    };

    _toDoCtrl.startEditing = function(todo) {
        console.log("hi");
        toDoService.startEditing(todo);
    }

    _toDoCtrl.cancelEditing = function(todo) {
        toDoService.cancelEditing(todo);
    }

    _toDoCtrl.update = function(todo, event) {

        //nasty logic to stop a 'blur' happening after 'enter'
        if (event === 'blur' && _toDoCtrl.saveEvent === 'enter') {
            _toDoCtrl.saveEvent = null;
            return
        } else if (event === "enter") {
            _toDoCtrl.saveEvent = 'enter';
        }
        toDoService.update(todo)

    };
})
