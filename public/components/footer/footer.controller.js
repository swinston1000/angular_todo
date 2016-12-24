angular.module("myApp")
    .controller('FooterController', function($uibModal, toDoService) {

        fCtrl = this;
        fCtrl.todo = {}

        fCtrl.hidebar = false;

        fCtrl.open = function() {

            fCtrl.hidebar = true;
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: function(elem, attr) {
                    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        return '/components/footer/modal/modal.ios.template.html';
                    }
                    return '/components/footer/modal/modal.template.html';
                },
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
                fCtrl.hidebar = false;
            }).catch(function(error) {
                fCtrl.hidebar = false;
                //console.error(error);
            });
        };
    })
