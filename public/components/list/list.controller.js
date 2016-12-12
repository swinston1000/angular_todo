angular.module("myApp").controller('listController', function(toDoService, mainFactory, $sce) {

    _thisCtrl = this;

    _thisCtrl.thermometer = $sce.trustAsHtml('<i class="fa fa-thermometer-half" aria-hidden="true"></i>');
    _thisCtrl.calender = $sce.trustAsHtml('<i class="fa fa-calendar-o" aria-hidden="true"></i>');
    _thisCtrl.tick = $sce.trustAsHtml('<i class="fa fa-check" aria-hidden="true"></i>');

    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.todo = { task: "", priority: 3, completed: false }
    _thisCtrl.applyFilter = false;
    _thisCtrl.sortByPriority = true;
    _thisCtrl.reverseSort = false
    _thisCtrl.toggleBtnText = "Show Active";
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
        if (confirm("Are you sure you want to delete the completed to-dos?")) {
            toDoService.removeCompleted();
        }
    };

});
