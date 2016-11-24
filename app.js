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
        removeAllCompletedToDos: removeAllCompletedToDos,
        toggleComplete: toggleComplete
    }
});

angular.module("myApp").controller('appCtrl', function($scope, $localStorage, $rootScope, toDoService) {

    _thisCtrl = this;
    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.applyFilter = false;
    _thisCtrl.toggleBtnText = "Show Active";
    _thisCtrl.add = function() {
        if (!this.todoInput) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo({ task: _thisCtrl.todoInput, completed: false });
        _thisCtrl.todoInput = ""
    };

    _thisCtrl.remove = function(index) {
        toDoService.removeTodo(index);
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

        //for dealing with escape key
        if (!event) {
            _thisCtrl.copies = angular.copy(_thisCtrl.todos);
        } else if (event === "escape") {
            _thisCtrl.copies = {};
        }

        //nasty logic to stop two event on enter!
        if (event === 'blur' && _thisCtrl.saveEvent === 'enter') {
            // don't do anything other than reset save event
            _thisCtrl.saveEvent = null;
        } else if (event == 'enter') {
            // by saving the save event we stop the proceeding blur changing itemToEdit = null;  
            _thisCtrl.saveEvent = 'enter';
            _thisCtrl.itemToEdit = null;
        } else {
            // for escape, standard blur and double-click!
            _thisCtrl.itemToEdit = index;
        }
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

    $scope.$watch(
        function() {
            return _thisCtrl.todos;
        },
        function() {
            _thisCtrl.todos = {}
            _thisCtrl.todos = $localStorage.todos;
        }, true
    );



});
