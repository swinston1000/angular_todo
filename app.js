angular.module("myApp", ["ngStorage"])
    // .run(function($rootScope, $window) {
    //     $rootScope.$broadcast('restorestate');
    //     //save on window unload
    //     angular.element($window).onbeforeunload = function(event) {
    //         $rootScope.$broadcast('savestate');
    //     };
    // })


// awesome solution to auto-focus from:
// http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
angular.module("myApp").directive('todoFocusMe', function($timeout) {
    return {
        scope: { trigger: '=todoFocusMe' },
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

angular.module("myApp").directive('todoEscape', function() {
    'use strict';

    var ESCAPE_KEY = 27;

    return function(scope, elem, attrs) {
        elem.bind('keydown', function(event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.todoEscape);
            }
        });

        scope.$on('$destroy', function() {
            elem.unbind('keydown');
        });
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

    // Used with ".run"
    // $rootScope.$on("savestate", function() {
    //     $localStorage.steven_todos = todos;
    // });
    // $rootScope.$on("restorestate", function() {
    //     todos = $localStorage.steven_todos;
    // }());


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

    var toggleComplete = function(index) {
        $localStorage.todos.items[index].completed = !$localStorage.todos.items[index].completed
    }

    return {
        todos: $localStorage.todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeAllCompletedToDos: removeAllCompletedToDos,
        toggleComplete: toggleComplete
    }
});

angular.module("myApp").controller('appCtrl', function($scope, toDoService) {

    _thisCtrl = this;
    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.applyFilter = true;
    _thisCtrl.toggleBtnText = "Show All";
    _thisCtrl.add = function() {
        if (!this.todoInput) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo({ task: _thisCtrl.todoInput, completed: false });
        _thisCtrl.todoInput = ""
    };

    _thisCtrl.remove = function(index) {
        if (confirm("Are you sure?")) {
            toDoService.removeTodo(index);
        }
    };

    _thisCtrl.toggleFilter = function() {
        _thisCtrl.applyFilter = !_thisCtrl.applyFilter;
        _thisCtrl.toggleBtnText = _thisCtrl.applyFilter ? "Show All" : "Show Active"
    };

    _thisCtrl.toggleComplete = function(index) {
        toDoService.toggleComplete(index)
    }

    _thisCtrl.escapeEdit = function(index) {
        _thisCtrl.todos.items[index] = angular.copy(_thisCtrl.copies.items[index])
        _thisCtrl.edit(null, 'escape')
    }

    _thisCtrl.edit = function(index, event) {

        //nasty logic to allow escapes and to stop double saving
        if (event === 'blur' && _thisCtrl.saveEvent === 'enter') {
            _thisCtrl.saveEvent = null;
            return;
        } else if (event === "double-click") {
            _thisCtrl.copies = angular.copy(_thisCtrl.todos);
        } else if (event === "escape") {
            _thisCtrl.copies = {};
        } else if (event == 'enter') {
            // by saving the save event we stop the following blur from doing anything
            _thisCtrl.saveEvent = 'enter';
        }
        _thisCtrl.itemToEdit = index;

    };


    _thisCtrl.filterComplete = function(item) {
        // return false to filter item 
        return _thisCtrl.applyFilter ? !item.completed : true;
    };

    _thisCtrl.removeCompleted = function() {
        if (confirm("Are you sure?")) {
            toDoService.removeAllCompletedToDos();
        }
    };

    $scope.$watch('myCtrl.applyFilter', function(newValue, oldValue) {
        _thisCtrl.newValue = newValue;
    });

    $scope.$watch(
        function() {
            return _thisCtrl.todos;
        },
        function() {
            //do something here to sync across tabs??
        }, true
    );



});
