var app = angular.module("myApp", []);

// awesome solution to auto-focus from:
// http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
angular.module("myApp").directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === true) {
                    $timeout(function() {
                        element[0].focus();
                        scope.trigger = false;
                    }, 0);
                }
            });
        }
    };
});

angular.module("myApp").service('toDoService', function() {

    this.todos = { items: [] };
    this.addTodo = function(todo) {
        this.todos.items.push(todo);
    }
    this.removeTodo = function(index) {
        this.todos.items.splice(index, 1);
        console.log(this.todos);
    };
    this.removeAllCompletedToDos = function() {
        this.todos.items = this.todos.items.filter(function(item) {
            return !item.completed;
        });
        //this.todos.splice(1, 1);
        //console.log(this.todos.items);
    }
});

angular.module("myApp").controller('appCtrl', function(toDoService) {
    this.todos = toDoService.todos;
    this.applyFilter = false;
    this.addItem = function() {
        if (!this.todoInput) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo({ task: this.todoInput, completed: false });
        this.todoInput = ""
    };
    this.removeItem = function(index) {
        toDoService.removeTodo(index);
    };
    this.editItem = function(index) {
        this.itemToEdit = index;
        console.log(this.todos);
    };
    this.filterComplete = function(_filter) {
        // if the filter is on/true we need to return false if the item is completed and true if not
        // otherwise, if the filter is off we return true for all items
        return function(item) {
            return _filter ? !item.completed : true;
        };
    };
    this.removeCompleted = function() {
        toDoService.removeAllCompletedToDos();
    };
});
