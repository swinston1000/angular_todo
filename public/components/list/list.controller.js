angular.module("myApp").controller('listController', function(toDoService, mainFactory, $sce) {

    vm = this;

    vm.todos = toDoService.todos;
    vm.todo = { task: "", priority: 3, completed: false }
    vm.loaded = toDoService.loaded

    vm.categoryText = "Category"

    vm.getBackgroundColour = mainFactory.getBackgroundColour;
    vm.setPriority = mainFactory.setPriority;
    vm.getPriority = mainFactory.getPriority;


    vm.setCategory = function(event) {
        vm.todo.category = vm.categoryText = event.target.innerHTML;
        vm.categoryChosen = true;
    }

    vm.add = function() {
        if (!this.todo.task) {
            return alert("Please enter an item!");
        } else if (!vm.categoryChosen) {
            return alert("Please choose a category!");
        }
        toDoService.addTodo(vm.todo);
        vm.todo = { task: "", priority: 3, completed: false }
        vm.categoryChosen = false;
        vm.categoryText = "Category"
    };



});
