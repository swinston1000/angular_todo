var app = angular.module("myApp", ["ngStorage"])
    // .run(function($rootScope, $window) {
    //     $rootScope.$broadcast('restorestate');
    //     //save on window unload
    //     angular.element($window).onbeforeunload = function(event) {
    //         $rootScope.$broadcast('savestate');
    //     };
    // })


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


angular.module("myApp").factory('toDoService', function($window, $rootScope, $localStorage) {

    // angular.element($window).on('storage', function(event) {
    //     alert(event);
    //     if (event.key === 'todos') {
    //         $rootScope.$apply();
    //     }
    // });
    // if (!$window.localStorage.getItem('todos')) {
    //     $window.localStorage.setItem('todos', JSON.stringify({ items: [] }))
    // }
    // var todos = JSON.parse($window.localStorage.getItem('todos'));


    if (!$localStorage.todos) {
        $localStorage.todos = { items: [] }
    }

    var addTodo = function(todo) {
        $localStorage.todos.items.push(todo);
        //$window.localStorage.setItem('todos', JSON.stringify(todos))
    }

    var removeTodo = function(index) {
        $localStorage.todos.items.splice(index, 1);
        //$window.localStorage.setItem('todos', JSON.stringify(todos))
    };
    var removeAllCompletedToDos = function() {
        $localStorage.todos.items = $localStorage.todos.items.filter(function(item) {
            return !item.completed;
        });
        //$window.localStorage.setItem('todos', JSON.stringify(todos))
    }

    // $rootScope.$on("savestate", function() {
    //     $localStorage.steven_todos = todos;
    // });
    // $rootScope.$on("restorestate", function() {
    //     todos = $localStorage.steven_todos;
    // }());

    return {
        todos: $localStorage.todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeAllCompletedToDos: removeAllCompletedToDos
    }
});

angular.module("myApp").controller('appCtrl', function($scope, toDoService) {

    _thisCtrl = this;
    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.applyFilter = false;
    _thisCtrl.addItem = function() {
        if (!this.todoInput) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo({ task: _thisCtrl.todoInput, completed: false });
        _thisCtrl.todoInput = ""
    };
    _thisCtrl.removeItem = function(index) {
        toDoService.removeTodo(index);
    };
    _thisCtrl.editItem = function(index) {
        _thisCtrl.itemToEdit = index;
    };
    _thisCtrl.filterComplete = function(item) {
        // if the filter is on/true we need to return false if the item is completed and true if not
        // otherwise, if the filter is off we return true for all items
        return _thisCtrl.applyFilter ? !item.completed : true;
    };

    _thisCtrl.removeCompleted = function() {
        toDoService.removeAllCompletedToDos();
    };

    $scope.$watch('myCtrl.applyFilter', function(newValue, oldValue) {
        _thisCtrl.newValue = newValue;
    });

});
