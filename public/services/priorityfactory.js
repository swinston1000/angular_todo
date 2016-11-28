angular.module('myApp').factory('priorityFactory', function(toDoService) {
    var colourMap = ['red', 'orange', 'yellow', 'green', 'blue']

    var getBackgroundColour = function() {
        return colourMap[this.todo.priority - 1]
    }

    var setPriority = function(event) {
        this.todo.priority = event.target.innerHTML;
    }

    return {
        getBackgroundColour: getBackgroundColour,
        setPriority: setPriority
    }
})
