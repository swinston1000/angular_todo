angular.module("myApp").controller('mainController', function($uibModal, $scope, $sce, toDoService) {

    this.active = $sce.trustAsHtml('<span class="fa-stack fa-lg"><i class="fa fa-check fa-stack-1x"></i> <i class="fa fa-ban fa-flip-horizontal fa-stack-2x text-danger"></i></span>');
    this.all = $sce.trustAsHtml('<i class="fa fa-check" aria-hidden="true"></i>');
    this.asc = $sce.trustAsHtml('<span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>');
    this.desc = $sce.trustAsHtml('<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>');
    this.search = {}
    this.applyFilter = false;
    this.filterCategory = false;
    this.sortBy = "+priority";
    this.priorityAsc = true; //priority order
    this.dateAsc = true; // date order
    this.sortByPriority = true; // what button is pressed


    this.todos = toDoService.todos;

    this.toggleFilter = function() {
        this.applyFilter = !this.applyFilter;
    };

    this.toggleSort = function(direction) {
        if (direction === "+priority" && this.sortBy.includes('priority')) {
            this.sortBy = direction;
            this.priorityAsc = true
        } else if (direction === "+priority") {
            this.sortBy = "-priority";
        } else if (direction === "-priority" && this.sortBy.includes('priority')) {
            this.sortBy = direction;
            this.priorityAsc = false
        } else if (direction === "-priority") {
            this.sortBy = "+priority";
        } else if (direction === "+_id" && this.sortBy.includes('id')) {
            this.sortBy = direction;
            this.dateAsc = true
        } else if (direction === "+_id") {
            console.log("here");
            this.sortBy = "-_id";
        } else if (direction === "-_id" && this.sortBy.includes('id')) {
            this.sortBy = direction;
            this.dateAsc = false
        } else if (direction === "-_id") {
            this.sortBy = "+_id";
        }
    }







    this.removeCompleted = function() {
        if (confirm("Are you sure you want to delete the completed to-dos?")) {
            toDoService.removeCompleted();
        }
    };

});
