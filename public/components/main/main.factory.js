angular.module('myApp').factory('mainFactory', function(toDoService) {
    var colourMap = ['red', 'orange', 'yellow', 'green', 'blue']

    var getBackgroundColour = function() {
        return colourMap[this.todo.priority - 1]
    }

    var setPriority = function(event, todo) {
        this.todo.priority = parseInt(event.target.innerHTML);
        if (todo) {
            toDoService.update(todo)
        }
    }

    return {
        getBackgroundColour: getBackgroundColour,
        setPriority: setPriority
    }
})
