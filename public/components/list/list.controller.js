angular.module("myApp").controller('listController', function(toDoService, mainFactory, $sce) {

    lCtrl = this;

    lCtrl.todos = toDoService.todos;
    lCtrl.todo = { task: "", priority: 3, completed: false }
    lCtrl.loaded = toDoService.loaded

    lCtrl.categoryText = "Category"

    lCtrl.getBackgroundColour = mainFactory.getBackgroundColour;
    lCtrl.setPriority = mainFactory.setPriority;
    lCtrl.getPriority = mainFactory.getPriority;


    lCtrl.setCategory = function(event) {
        lCtrl.todo.category = lCtrl.categoryText = event.target.innerHTML;
        lCtrl.categoryChosen = true;
    }

    lCtrl.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        } else if (!lCtrl.categoryChosen) {
            return alert("Please choose a category!");
        }
        toDoService.addTodo(lCtrl.todo);
        lCtrl.todo = { task: "", priority: 3, completed: false }
        lCtrl.categoryChosen = false;
        lCtrl.categoryText = "Category"
    };



});
