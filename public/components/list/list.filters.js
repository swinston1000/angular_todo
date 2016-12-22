angular.module('myApp').filter('filterCategory', function() {
    return function(todos, filterCategory) {
        var filteredInput = {};
        if (filterCategory) {
            angular.forEach(todos, function(item, key) {
                if (item.category === filterCategory) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput
        } else {
            angular.forEach(todos, function(item, key) {
                if (item) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput
        }

    }
});

angular.module('myApp').filter('filterComplete', function() {
    return function(todos, applyFilter) {
        var filteredInput = {};
        if (applyFilter) {
            angular.forEach(todos, function(item, key) {
                if (item.completed !== true) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput;
        } else {
            angular.forEach(todos, function(item, key) {
                if (item) {
                    filteredInput[key] = item;
                }
            });
            return filteredInput
        }
    }
});

// angular.module('myApp').filter('orderByPriority', function() {
//     return function(items, sort, reverse) {
//         var sortType = "";
//         var filtered = [];
//         if (!sort) sortType = 'id';
//         else sortType = 'priority';
//         angular.forEach(items, function(item) {
//             filtered.push(item);
//         });
//         filtered.sort(function(a, b) {
//             return (a[sortType] > b[sortType] ? 1 : -1);
//         });
//         if (reverse) filtered.reverse();
//         return filtered;
//     };
// });
