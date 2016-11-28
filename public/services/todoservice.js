angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage, mongoService) {

    var copy = []
    var editing = []
    var todos = { items: [] }

    mongoService.getToDos().success(function(data) {
        todos.items = data;
    }).error(function(data, status) {
        console.log(data, status);
    });

    var cancelEditing = function(index) {
        editing[index].editing = false;
    }

    var setEditing = function(index) {
        copy[index] = angular.copy(todos.items[index])
        editing[index].editing = true;
    }

    var getCopy = function(index) {
        todos.items[index] = angular.copy(copy[index])
    }

    var getPriority = function(index) {
        var item = todos.items.find(function(item) {
            return item.index == index
        })
        return item.priority
    }

    var addTodo = function(todo) {
        mongoService.add(todo).success(function(data) {
            console.log(data);
            todos.items.push(data);
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    var removeTodo = function(index) {
        console.log(todos.items);
        console.log(index);
        var id = todos.items[index]._id;
        mongoService.delete(id).success(function(data) {
            console.log(data);
            todos.items.splice(index, 1);
        }).error(function(data, status) {
            console.log(data, status);
        });;
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
        cancelEditing: cancelEditing,
        editing: editing
    }
});
