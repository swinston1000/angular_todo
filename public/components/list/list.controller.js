angular.module("myApp").controller('listController', function(toDoService, mainFactory, $sce) {

    _thisCtrl = this;

    _thisCtrl.todos = toDoService.todos;
    _thisCtrl.todo = { task: "", priority: 3, completed: false }

    _thisCtrl.categoryText = "Category"

    _thisCtrl.getBackgroundColour = mainFactory.getBackgroundColour;
    _thisCtrl.setPriority = mainFactory.setPriority;
    _thisCtrl.getPriority = mainFactory.getPriority;


    _thisCtrl.setCategory = function(event) {
        _thisCtrl.todo.category = _thisCtrl.categoryText = event.target.innerHTML;
        _thisCtrl.categoryChosen = true;
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
