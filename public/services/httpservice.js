angular.module("myApp").service('mongoService', function($http) {

    this.getToDos = function() {
        return $http.get('/todos');
    }

    this.updateToDo = function(id, item) {
        $http.put('todos/id', item);
    }

    this.add = function(item) {
        return $http.post('todos/', item);
    }

    this.delete = function(id) {
        return $http.delete('todos/' + id);
    }

})
