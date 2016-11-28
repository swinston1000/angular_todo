angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage, httpService) {

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

        var todelete = todos.items.filter(function(item) {
            return item.completed === true;
        })
        var ids = todelete.map(function(todo) {
            return todo._id;
        })

        httpService.deleteCompleted(ids).success(function(data) {
            todelete.forEach(function(todo) {
                todos.items.splice(todos.items.indexOf(todo), 1)
            });
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
