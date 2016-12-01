angular.module("myApp").service('toDoService', function($timeout, $rootScope, httpService) {

    that = this;

    this.editing = {}
    this.todos = { items: [] }


    $timeout(function() {
        httpService.getToDos().success(function(data) {
            that.todos.items = data;
        }).error(function(data, status) {
            console.log(data, status);
        });
    }, 5000)



    this.update = function(todo) {
        httpService.update(todo).success(function(data) {
            that.editing[todo._id] = undefined;
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    this.startEditing = function(todo) {
        that.editing[todo._id] = angular.copy(todo)
    }

    this.cancelEditing = function(todo) {
        var _index = that.todos.items.indexOf(todo)
        that.todos.items[_index] = angular.copy(that.editing[todo._id]);
        that.editing[todo._id] = undefined;
    }

    this.addTodo = function(todo) {
        httpService.add(todo).success(function(data) {
            that.todos.items.push(data);
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

    this.removeTodo = function(todo) {
        httpService.delete(todo._id).success(function(data) {
            that.todos.items.splice(that.todos.items.indexOf(todo), 1);
        }).error(function(data, status) {
            console.log(data, status);
        });;
    };

    this.removeCompleted = function() {

        var indices = []
        var ids = []

        that.todos.items.forEach(function(item, index) {
            if (item.completed === true) {
                indices.push(index)
                ids.push(item._id)
            }
        })
        indices = indices.reverse(); //as we need to start removal from the end!!!

        httpService.deleteCompleted(ids).success(function(data) {
            indices.forEach(function(index) {
                that.todos.items.splice(index, 1)
            })
        }).error(function(data, status) {
            console.log(data, status);
        });
    }

});
