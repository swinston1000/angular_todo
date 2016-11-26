angular.module("myApp").controller('toDoController', function(toDoService, priorityFactory) {

    _toDoCtrl = this;

    _toDoCtrl.getBackgroundColour = priorityFactory.getBackgroundColour;

    _toDoCtrl.setPriority = priorityFactory.setPriority;

    _toDoCtrl.toggleComplete = function(id) {
        toDoService.toggleComplete(id)
    }

    _toDoCtrl.remove = function(id) {
        if (confirm("Are you sure?")) {
            toDoService.removeTodo(id);
        }
    };

    _toDoCtrl.edit = function(id, event) {

        //nasty logic to stop a 'blur' happening after 'enter'
        if (event === "double-click") {
            toDoService.setEditing(id);
            return;
        } else if (event === 'blur' && _toDoCtrl.saveEvent === 'enter') {
            _toDoCtrl.saveEvent = null;
            return;
        } else if (event === "enter") {
            _toDoCtrl.saveEvent = 'enter';
        }

        toDoService.cancelEditing(id)
    };

    _toDoCtrl.escapeEdit = function(id) {
        toDoService.getCopy(id);
    }

})
