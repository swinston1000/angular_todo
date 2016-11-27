angular.module("myApp").controller('toDoController', function(toDoService, priorityFactory) {

    _toDoCtrl = this;

    _toDoCtrl.editing = toDoService.editing;

    _toDoCtrl.getBackgroundColour = priorityFactory.getBackgroundColour;

    _toDoCtrl.setPriority = priorityFactory.setPriority;

    _toDoCtrl.toggleComplete = function(id) {
        toDoService.toggleComplete(id)
    }

    _toDoCtrl.update = function(id) {
        console.log(id);
    }

    _toDoCtrl.remove = function(id) {
        if (confirm("Are you sure?")) {
            toDoService.removeTodo(id);
        }
    };

    _toDoCtrl.startEditing = function(id) {
        toDoService.startEditing(id);
    }

    _toDoCtrl.cancelEditing = function(id) {
        toDoService.cancelEditing(id);
    }

    _toDoCtrl.update = function(id, event) {

        //nasty logic to stop a 'blur' happening after 'enter'
        if (event === 'blur' && _toDoCtrl.saveEvent === 'enter') {
            _toDoCtrl.saveEvent = null;
            return
        } else if (event === "enter") {
            _toDoCtrl.saveEvent = 'enter';
        }
        toDoService.update(id)

    };


})
