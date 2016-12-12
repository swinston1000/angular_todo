angular.module('myApp').factory('mainFactory', function(toDoService) {
    var colourMap = ['red', 'orange', 'yellow', 'green', 'blue']
    var priorityMap = ['one', 'two', 'three', 'four', 'five']

    var getBackgroundColour = function() {
        return colourMap[this.todo.priority - 1]
    }

    var setPriority = function(event, todo) {
        this.todo.priority = parseInt(event.target.innerHTML);
        if (todo) {
            toDoService.update(todo)
        }
    }

    var getPriority = function(event, todo) {
        return priorityMap[this.todo.priority - 1]
    }

    return {
        getBackgroundColour: getBackgroundColour,
        setPriority: setPriority,
        getPriority: getPriority
    }
})
