angular.module("myApp").service('mongoService', function($http) {

    this.getToDos = function() {
        $http.get('http://localhost:3000', { message: "Hi from the other side" });
    }

    this.updateToDo = function(id, item) {
        $http.put('http://localhost:3000', { id: id, todo: item });
    }

    this.addToDo = function(item) {

        //get newID;
        item.id = 0;
        //newID++;

        $http.post('http://localhost:3000', { 0: item });
    }

    this.deleteToDo = function(id) {
        $http.delete('http://localhost:3000', { id: id });
    }

})
