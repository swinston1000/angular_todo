angular.module("myApp").factory('toDoService', function($timeout, $window, socket, $rootScope, httpService) {

    var editing = {}
    var todos = { items: [] }
        //var loaded = { status: false }

    var getTodos = function() {
        httpService.getToDos().then(function(data) {
            if (!data.data.error) {
                todos.items = data.data;
            } else {}
        }, function(error) {
            if (error && error.data) {
                $window.onfocus = function() {} //remove listener to stop endless alert loop!
                alert(error.data);

            }
        });
    }

    //load todos on page load
    //the timeouts allow authentication and the navbar to rise to happen first!
    $timeout(function() {
        $timeout(function() {
            getTodos();
        }, 0)
    }, 0)

    socket.on('change', function(user) {
        if ($rootScope.user = user.user) {
            getTodos();
        }
    });

    $window.onfocus = function() {
        //timeout stops the focus event interfering with page load
        $timeout(function() {
            getTodos();
        }, 0)
    }

    var update = function(todo) {
        httpService.update(todo).then(function(data) {
            editing[todo._id] = undefined;
            socket.emit('update', { user: $rootScope.user })
        }).catch(function(error) {
            console.error(error);
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
        httpService.add(todo).then(function(data) {
            todos.items.push(data.data);
            socket.emit('update', { user: $rootScope.user })
        }).catch(function(error) {
            console.error(error);
        });
    }

    var removeTodo = function(todo) {
        httpService.delete(todo._id).then(function(data) {
            todos.items.splice(todos.items.indexOf(todo), 1);
            socket.emit('update', { user: $rootScope.user })
        }).catch(function(error) {
            console.error(error);
        });;
    };

    var removeCompleted = function() {

        httpService.deleteCompleted("yes").then(function(data) {

            var indices = []
            todos.items.forEach(function(item, index) {
                if (item.completed === true) {
                    indices.push(index)
                }
            })
            indices = indices.reverse(); //as we need to start removal from the end!!!
            indices.forEach(function(index) {
                todos.items.splice(index, 1)
            })

            socket.emit('update', { user: $rootScope.user })

        }).catch(function(error) {
            alert(error)
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
        editing: editing,
        //loaded: loaded
    }
});
