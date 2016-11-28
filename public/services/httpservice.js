angular.module("myApp").service('httpService', function($http) {

    this.getToDos = function() {
        return $http.get('/todos');
    }

    this.update = function(item) {
        return $http.put('todos/' + item._id, item);
    }

    this.add = function(item) {
        return $http.post('todos/', item);
    }

    this.delete = function(id) {
        return $http.delete('todos/' + id);
    }

    this.deleteCompleted = function(id) {
        return $http.delete('todos/done/' + id);
    }

})
