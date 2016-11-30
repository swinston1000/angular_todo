angular.module("myApp").factory('toDoService', function($window, $rootScope, httpService) {

    var editing = {}
    var todos = { items: [] }

    httpService.getToDos().success(function(data) {
        todos.items = data;
    }).error(function(data, status) {
        console.log(data, status);
    });

    var update = function(todo) {
        httpService.update(todo).success(function(data) {
            editing[todo._id] = undefined;
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    var startEditing = function(todo) {
        editing[todo._id] = angular.copy(todo)
    }

    var cancelEditing = function(todo) {
        var _index = todos.items.indexOf(todo)
        todos.items[_index] = angular.copy(editing[todo._id]);
        editing[todo._id] = undefined;
    }

    var addTodo = function(todo) {
        httpService.add(todo).success(function(data) {
            todos.items.push(data);
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    var removeTodo = function(todo) {
        httpService.delete(todo._id).success(function(data) {
            todos.items.splice(todos.items.indexOf(todo), 1);
        }).error(function(data, status) {
            console.log(data, status);
        });;
    };

    var removeCompleted = function() {

        var indices = []
        var ids = []

        todos.items.forEach(function(item, index) {
            if (item.completed === true) {
                indices.push(index)
                ids.push(item._id)
            }
        })
        indices = indices.reverse(); //as we need to start removal from the end!!!

        httpService.deleteCompleted(ids).success(function(data) {
            indices.forEach(function(index) {
                todos.items.splice(index, 1)
            })
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    return {
        todos: todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeCompleted: removeCompleted,
        cancelEditing: cancelEditing,
        update: update,
        startEditing: startEditing,
        editing: editing
    }
});
