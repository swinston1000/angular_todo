angular.module('myApp').factory('priorityFactory', function(toDoService) {
    var colourMap = ['red', 'orange', 'yellow', 'green', 'blue']

    var getBackgroundColour = function(id) {
        if (!id) {
            return colourMap[this.todo.priority - 1]
        } else {
            return colourMap[toDoService.getPriority(id) - 1]
        }
    }
    var setPriority = function(event, id) {
        if (!id) {
            this.todo.priority = event.target.innerHTML;
        } else {
            toDoService.setPriority(event.target.innerHTML, id)
        }
    }
    return {
        getBackgroundColour: getBackgroundColour,
        setPriority: setPriority
    }
})
