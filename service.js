angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage, mongoService) {

    var copy = {}

    var todos = getToDos()
    if (!todos) {
        todos = { nextid: 1, items: {} }
    }

    var addTodo = function(todo) {
        mongoService.add(todo)
        todos = mongoService.getToDos()
    }

    var removeTodo = function(id) {
        mongoService.delete(id);
        todos = mongoService.getToDos()

    };

    var removeAllCompletedToDos = function() {
        var results = {}
        angular.forEach($localStorage.todos.items, function(item, id) {
            if (!item.completed) {
                results[id] = item
            }
        });
        $localStorage.todos.items = results
    }

    var toggleComplete = function(id) {
        $localStorage.todos.items[id].completed = !$localStorage.todos.items[id].completed;
    }

    var setPriority = function(priority, id) {
        $localStorage.todos.items[id].priority = parseInt(priority);
    }

    var getPriority = function(id) {
        return $localStorage.todos.items[id] && $localStorage.todos.items[id].priority;
    }

    var getCopy = function(id) {
        $localStorage.todos.items[id] = angular.copy(copy[id])
    }

    var setEditing = function(id) {
        copy[id] = angular.copy($localStorage.todos.items[id])
        $localStorage.todos.items[id].editing = true;
    }
    var cancelEditing = function(id) {
        $localStorage.todos.items[id].editing = false;
    }

    return {
        todos: todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeAllCompletedToDos: removeAllCompletedToDos,
        toggleComplete: toggleComplete,
        setPriority: setPriority,
        getPriority: getPriority,
        getCopy: getCopy,
        setEditing: setEditing,
        cancelEditing: cancelEditing
    }
});
