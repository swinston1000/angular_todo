angular.module("myApp").controller('mainController', function($timeout, $scope, toDoService, mainFactory, $sce, $ync) {


    $scope.thermometer = $sce.trustAsHtml('<i class="fa fa-thermometer-half" aria-hidden="true"></i>');
    $scope.calender = $sce.trustAsHtml('<i class="fa fa-calendar-o" aria-hidden="true"></i>');

    $scope.todos = toDoService.todos;
    $scope.todo = { task: "", priority: 3, completed: false }
    $scope.applyFilter = true;
    $scope.sortByPriority = true;
    $scope.reverseSort = false
    $scope.toggleBtnText = "Show All";
    $scope.categoryText = "Category"

    $scope.getBackgroundColour = mainFactory.getBackgroundColour;
    $scope.setPriority = mainFactory.setPriority;

    $scope.toggleFilter = function() {
        $scope.applyFilter = !$scope.applyFilter;
        $scope.toggleBtnText = $scope.applyFilter ? "Show All" : "Show Active"
    };

    $scope.toggleSort = function() {
        $scope.sortByPriority = !$scope.sortByPriority;
    }

    $scope.setCategory = function(event) {
        $scope.todo.category = $scope.categoryText = event.target.innerHTML;
        $scope.categoryChosen = true;
    }


    $scope.setFilterCategory = function(event) {
        $scope.filterCategory = event.target.innerHTML === "Show All" ? false : event.target.innerHTML;
    }

    $scope.add = function() {

        if (!this.todo.task) {
            return alert("Please enter an item!");
        } else if (!$scope.categoryChosen) {
            return alert("Please choose a category!");
        }
        http: //localhost:3000/
            console.log($scope.todo);
        toDoService.addTodo($scope.todo);
        $scope.todo = { task: "", priority: 3, completed: false }
        $scope.categoryChosen = false;
        $scope.categoryText = "Category"
    };

    $scope.removeCompleted = function() {
        if (confirm("Are you sure?")) {
            toDoService.removeCompleted();
        }
    };

    var keys = ['todos']

    $ync($scope, keys, 'myRoom')

    // $scope.$watch('myCtrl.applyFilter', function(newValue, oldValue) {
    //     $scope.newValue = newValue;SS
    // });
    // $scope.$watch(
    //     function() {
    //         return $scope.todos;
    //     },
    //     function() {
    //         $scope.syncme = $scope.todos;
    //         $timeout(function() {
    //             console.log("done");
    //             $scope.todos = $scope.syncme
    //         }, 2000)
    //     }, true
    // );

});
