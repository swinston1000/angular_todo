angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage) {

    var todos = { copy: {} }

    if (!$localStorage.todos) {
        $localStorage.todos = { nextid: 1, items: {} }
    }

    var addTodo = function(todo) {
        $localStorage.todos.items[$localStorage.todos.nextid] = todo;
        $localStorage.todos.items[$localStorage.todos.nextid].id = $localStorage.todos.nextid++
    }

    var removeTodo = function(id) {
        delete $localStorage.todos.items[id];

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
        $localStorage.todos.items[id] = angular.copy(todos.copy[id])
    }

    var setEditing = function(id) {
        todos.copy[id] = angular.copy($localStorage.todos.items[id])
        $localStorage.todos.items[id].editing = true;
    }
    var cancelEditing = function(id) {
        $localStorage.todos.items[id].editing = false;
    }

    return {
        todos: $localStorage.todos,
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
