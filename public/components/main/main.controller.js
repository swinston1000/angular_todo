angular.module("myApp").controller('mainController', function($sce) {

    this.thermometer = $sce.trustAsHtml('<i class="fa fa-thermometer-half" aria-hidden="true"></i>');
    this.calender = $sce.trustAsHtml('<i class="fa fa-calendar-o" aria-hidden="true"></i>');
    this.search = {}
    this.applyFilter = false;
    this.sortByPriority = true;
    this.reverseSort = false
    this.toggleBtnText = "Show Active";

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

});
