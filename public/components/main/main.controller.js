angular.module("myApp").controller('mainController', function($uibModal, $scope, $sce, toDoService) {

    this.thermometer = $sce.trustAsHtml('<i class="fa fa-thermometer-half" aria-hidden="true"></i>');
    this.calender = $sce.trustAsHtml('<i class="fa fa-calendar-o" aria-hidden="true"></i>');
    this.search = {}
    this.applyFilter = false;
    this.sortByPriority = true;
    this.reverseSort = false;
    this.filterCategory = false;
    this.toggleBtnText = "Show Active";
    this.todos = toDoService.todos;

    this.toggleFilter = function() {
        this.applyFilter = !this.applyFilter;
        this.toggleBtnText = this.applyFilter ? "Show All" : "Show Active"
    };

    this.toggleSort = function() {
        this.sortByPriority = !this.sortByPriority;
    }

    this.setFilterCategory = function(event) {
        this.filterCategory = event.target.innerHTML === "Show All" ? false : event.target.innerHTML;
    }

    this.removeCompleted = function() {
        if (confirm("Are you sure you want to delete the completed to-dos?")) {
            toDoService.removeCompleted();
        }
    };

});
