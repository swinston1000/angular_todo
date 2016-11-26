angular.module("myApp", ["ngStorage"])

angular.module("myApp").controller('mainController', function($scope, toDoService, priorityFactory) {

    _thisCtrl = this;
    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.todo = { task: "", priority: 3, completed: false }
    _thisCtrl.applyFilter = true;
    _thisCtrl.sortByPriority = false;
    _thisCtrl.reverseSort = false
    _thisCtrl.toggleBtnText = "Show All";

    _thisCtrl.getBackgroundColour = priorityFactory.getBackgroundColour;
    _thisCtrl.setPriority = priorityFactory.setPriority;

    _thisCtrl.toggleFilter = function() {
        _thisCtrl.applyFilter = !_thisCtrl.applyFilter;
        _thisCtrl.toggleBtnText = _thisCtrl.applyFilter ? "Show All" : "Show Active"
    };

    _thisCtrl.toggleSort = function() {
        _thisCtrl.sortByPriority = !_thisCtrl.sortByPriority;
    }

    _thisCtrl.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        }
        toDoService.addTodo(_thisCtrl.todo);
        _thisCtrl.todo = { task: "", priority: 3, completed: false, editing: false }
    };

    _thisCtrl.removeCompleted = function() {
        if (confirm("Are you sure?")) {
            toDoService.removeAllCompletedToDos();
        }
    };

    $scope.$watch('myCtrl.applyFilter', function(newValue, oldValue) {
        _thisCtrl.newValue = newValue;
    });

    // $scope.$watch(
    //     function() {
    //         return _thisCtrl.todos;
    //     },
    //     function() {
    //         console.log(_thisCtrl.todos);
    //     }, true
    // );



});
