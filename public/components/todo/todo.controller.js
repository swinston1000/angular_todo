angular.module("myApp").controller('toDoController', function(toDoService, mainFactory) {

    tdCtrl = this;

    tdCtrl.editing = toDoService.editing;

    tdCtrl.getBackgroundColour = mainFactory.getBackgroundColour;

    tdCtrl.getPriority = mainFactory.getPriority;

    tdCtrl.updatePriority = mainFactory.setPriority;

    tdCtrl.toggle = function(todo) {
        todo.completed = !todo.completed
        toDoService.update(todo)
    }

    tdCtrl.remove = function(todo) {
        if (confirm("Are you sure you want to delete this to-do?")) {
            toDoService.removeTodo(todo);
        }
    };

    tdCtrl.startEditing = function(todo) {
        toDoService.startEditing(todo);
    }

    tdCtrl.cancelEditing = function(todo) {
        toDoService.cancelEditing(todo);
    }

    tdCtrl.update = function(todo, event) {

        //nasty logic to stop a 'blur' happening after 'enter'
        if (event === 'blur' && tdCtrl.saveEvent === 'enter') {
            tdCtrl.saveEvent = null;
            return
        } else if (event === "enter") {
            tdCtrl.saveEvent = 'enter';
        }
        toDoService.update(todo)

    };
})
