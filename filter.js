angular.module('myApp').filter('filterComplete', function() {
    return function(todos, applyFilter) {
        if (applyFilter) {
            var filteredInput = {};
            angular.forEach(todos, function(item, key) {
                if (item.completed !== true) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput;
        } else
            return todos
    }
});
