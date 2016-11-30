angular.module("myApp").controller('mainController', function($timeout, $scope, toDoService, mainFactory, $sce, $ync) {

    _thisCtrl = this;

    _thisCtrl.thermometer = $sce.trustAsHtml('<i class="fa fa-thermometer-half" aria-hidden="true"></i>');
    _thisCtrl.calender = $sce.trustAsHtml('<i class="fa fa-calendar-o" aria-hidden="true"></i>');

    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.todo = { task: "", priority: 3, completed: false }
    _thisCtrl.applyFilter = true;
    _thisCtrl.sortByPriority = true;
    _thisCtrl.reverseSort = false
    _thisCtrl.toggleBtnText = "Show All";
    _thisCtrl.categoryText = "Category"

    _thisCtrl.getBackgroundColour = mainFactory.getBackgroundColour;
    _thisCtrl.setPriority = mainFactory.setPriority;

    _thisCtrl.toggleFilter = function() {
        _thisCtrl.applyFilter = !_thisCtrl.applyFilter;
        _thisCtrl.toggleBtnText = _thisCtrl.applyFilter ? "Show All" : "Show Active"
    };

    _thisCtrl.toggleSort = function() {
        _thisCtrl.sortByPriority = !_thisCtrl.sortByPriority;
    }

    _thisCtrl.setCategory = function(event) {
        _thisCtrl.todo.category = _thisCtrl.categoryText = event.target.innerHTML;
        _thisCtrl.categoryChosen = true;
    }


    _thisCtrl.setFilterCategory = function(event) {
        _thisCtrl.filterCategory = event.target.innerHTML === "Show All" ? false : event.target.innerHTML;
    }

    _thisCtrl.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        } else if (!_thisCtrl.categoryChosen) {
            return alert("Please choose a category!");
        }
        toDoService.addTodo(_thisCtrl.todo);
        _thisCtrl.todo = { task: "", priority: 3, completed: false }
        _thisCtrl.categoryChosen = false;
        _thisCtrl.categoryText = "Category"
    };

    _thisCtrl.removeCompleted = function() {
        if (confirm("Are you sure?")) {
            toDoService.removeCompleted();
        }
    };

    var keys = ['todos']

    $ync($scope, keys, 'myRoom')

    // $scope.$watch('myCtrl.applyFilter', function(newValue, oldValue) {
    //     _thisCtrl.newValue = newValue;SS
    // });
    // $scope.$watch(
    //     function() {
    //         return _thisCtrl.todos;
    //     },
    //     function() {
    //         $scope.syncme = _thisCtrl.todos;
    //         $timeout(function() {
    //             console.log("done");
    //             _thisCtrl.todos = $scope.syncme
    //         }, 2000)
    //     }, true
    // );

});
