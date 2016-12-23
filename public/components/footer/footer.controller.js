angular.module("myApp").controller('FooterController', function(toDoService, mainFactory, $sce) {

    fCtrl = this;

    fCtrl.todo = { task: "", priority: 3, completed: false }

    fCtrl.categoryText = "Category"

    fCtrl.getBackgroundColour = mainFactory.getBackgroundColour;
    fCtrl.setPriority = mainFactory.setPriority;
    fCtrl.getPriority = mainFactory.getPriority;


    fCtrl.setCategory = function(event) {
        fCtrl.todo.category = fCtrl.categoryText = event.target.innerHTML;
        fCtrl.categoryChosen = true;
    }

    fCtrl.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        } else if (!fCtrl.categoryChosen) {
            return alert("Please choose a category!");
        }
        toDoService.addTodo(fCtrl.todo);
        fCtrl.todo = { task: "", priority: 3, completed: false }
        fCtrl.categoryChosen = false;
        fCtrl.categoryText = "Category"
    };

});
