angular.module("myApp")
    .controller('FooterController', function($uibModal, toDoService) {

        fCtrl = this;
        fCtrl.todo = {}

        fCtrl.open = function() {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addtodo.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mCtrl',
                //bindToController: true,
            });

            modalInstance.result.then(function(todo) {
                angular.copy(todo, fCtrl.todo)
                if (!fCtrl.todo.category) {
                    fCtrl.todo.category = "N/A";
                }
                toDoService.addTodo(fCtrl.todo);

            }).catch(function(error) {
                //console.error(error);
            });
        };
    })
    .controller('ModalInstanceCtrl', function($uibModalInstance, mainFactory) {

        var mCtrl = this;
        mCtrl.todo = { task: "", priority: 3, completed: false }
        mCtrl.getBackgroundColour = mainFactory.getBackgroundColour;

        mCtrl.ok = function() {
            if (!mCtrl.todo.task) {
                return alert("Please enter an item!");
            }
            $uibModalInstance.close(mCtrl.todo);
        };

        mCtrl.cancel = function() {
            $uibModalInstance.dismiss('Dismissed');
        };
    });