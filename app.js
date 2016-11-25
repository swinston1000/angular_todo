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

    // Used with ".run"
    // $rootScope.$on("savestate", function() {
    //     $localStorage.steven_todos = todos;
    // });
    // $rootScope.$on("restorestate", function() {
    //     todos = $localStorage.steven_todos;
    // }());


    if (!$localStorage.todos) {
        $localStorage.todos = { id: 0, items: {} }
    }

    var addTodo = function(todo) {
        $localStorage.todos.items[++$localStorage.todos.id] = todo;
    }

    var removeTodo = function(id) {
        delete $localStorage.todos.items[id];

    };
    var removeAllCompletedToDos = function() {
        // $localStorage.todos.items = $localStorage.todos.items.filter(function(item) {
        //     return !item.completed;
        // });
    }

    var toggleComplete = function(id) {
        $localStorage.todos.items[id].completed = !$localStorage.todos.items[id].completed
    }

    var setPriority = function(priority, id) {
        $localStorage.todos.items[id].priority = parseInt(priority);
    }

    return {
        todos: $localStorage.todos,
        addTodo: addTodo,
        removeTodo: removeTodo,
        removeAllCompletedToDos: removeAllCompletedToDos,
        toggleComplete: toggleComplete,
        setPriority: setPriority
    }
});

angular.module('myApp').filter('filterComplete', function() {
    return function(todos, applyFilter) {
        if (applyFilter) {
            var filteredInput = {};
            angular.forEach(todos, function(item, key) {
                if (item.completed !== true) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput;
        } else
            return todos
    }
});

angular.module("myApp").controller('appCtrl', function($scope, toDoService) {

    _thisCtrl = this;
    _thisCtrl.todo = { task: "", priority: 3, completed: false }
    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.applyFilter = true;
    _thisCtrl.toggleBtnText = "Show All";

    _thisCtrl.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo(_thisCtrl.todo);
        _thisCtrl.todo = { task: "", priority: 3, completed: false }
    };

    _thisCtrl.setPriority = function(event, id) {
        if (!id) {
            _thisCtrl.todo.priority = event.toElement.innerHTML;
        } else {
            toDoService.setPriority(event.toElement.innerHTML, id)
        }
    }

    var colourMap = ['blue', 'green', 'yellow', 'orange', 'red']

    _thisCtrl.getBackgroundColour = function(id) {
        if (!id) {
            return colourMap[_thisCtrl.todo.priority - 1]
        } else {
            return colourMap[_thisCtrl.todos.items[id].priority - 1]
        }
    }

    _thisCtrl.remove = function(id) {
        if (confirm("Are you sure?")) {
            toDoService.removeTodo(id);
        }
    };

    _thisCtrl.toggleFilter = function() {
        _thisCtrl.applyFilter = !_thisCtrl.applyFilter;
        _thisCtrl.toggleBtnText = _thisCtrl.applyFilter ? "Show All" : "Show Active"
    };

    _thisCtrl.toggleComplete = function(id) {
        toDoService.toggleComplete(id)
    }

    _thisCtrl.escapeEdit = function(id) {
        _thisCtrl.todos.items[id] = angular.copy(_thisCtrl.copies.items[id])
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
            //console.log(_thisCtrl.todos);
        }, true
    );



});
