angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage, mongoService) {

    var editing = {}
    var todos = { items: [] }

    mongoService.getToDos().success(function(data) {
        todos.items = data;
    }).error(function(data, status) {
        console.log(data, status);
    });

    var update = function(id) {
        editing[id] = undefined;
    }

    var startEditing = function(id) {
        editing[id] = angular.copy(todos.items.find(function(item) {
            return id === item._id
        }))
    }

    var cancelEditing = function(id) {
        var index = todos.items.findIndex(function(item) {
            return id === item._id;
        })
        todos.items[index] = angular.copy(editing[id]);
        editing[id] = undefined;
    }

    var addTodo = function(todo) {
        mongoService.add(todo).success(function(data) {
            console.log(data);
            todos.items.push(data);
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    var removeTodo = function(id) {
        mongoService.delete(id).success(function(data) {
            todos.items.splice(todos.items.indexOf(data), 1);
        }).error(function(data, status) {
            console.log(data, status);
        });;
    };

    //TODO!!!
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
        todos.items[id].completed = !$localStorage.todos.items[id].completed;
    }

    var setPriority = function(priority, id) {

        todos.items[id].priority = parseInt(priority);
    }


    return {
        todos: todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeAllCompletedToDos: removeAllCompletedToDos,
        toggleComplete: toggleComplete,
        setPriority: setPriority,
        cancelEditing: cancelEditing,
        update: update,
        startEditing: startEditing,
        editing: editing
    }
});
