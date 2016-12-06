angular.module("myApp").factory('toDoService', function($window, socket, $rootScope, httpService) {

    var editing = {}
    var todos = { items: [] }

    var getTodos = function() {
        httpService.getToDos().then(function(data) {
            todos.items = data.data;
        }, function(error) {
            //console.log(error);
        });
    }

    //timeout allows authentication before todos are loaded for first time
    setTimeout(function() {
        getTodos();
    }, 0)

    socket.on('change', function(fromServer) {
        getTodos();
    });

    $window.onfocus = function() {
        //timeout stops the focus event interfering with page load
        setTimeout(function() {
            console.log("focus");
            getTodos();
        }, 0)
    }

    var update = function(todo) {
        httpService.update(todo).success(function(data) {
            editing[todo._id] = undefined;
            socket.emit('update', { message: 'update' })
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
            socket.emit('update', { message: 'new' })
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    var removeTodo = function(todo) {
        httpService.delete(todo._id).success(function(messsage) {
            todos.items.splice(todos.items.indexOf(todo), 1);
            socket.emit('update', { message: 'delete' })
        }).error(function(data, status) {
            console.log(data, status);
        });;
    };

    var removeCompleted = function() {

        httpService.deleteCompleted("yes").success(function(data) {

            // the focus event actually updates todos.items 
            // so we don't have to!!!!

            // var indices = []
            // todos.items.forEach(function(item, index) {
            //     if (item.completed === true) {
            //         indices.push(index)
            //     }
            // })
            // indices = indices.reverse(); //as we need to start removal from the end!!!

            // indices.forEach(function(index) {
            //     todos.items.splice(index, 1)
            // })

            socket.emit('update', { message: 'multi-delete' })

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
