angular.module("myApp")
    .controller('FooterController', function($uibModal, toDoService, $sce) {

        $ctrl = this;

        $ctrl.$onInit = function() {
            $ctrl.controls = $ctrl.mainCtrl
        };

        $ctrl.todo = {}

        $ctrl.hidebar = false;

        $ctrl.open = function() {

            $ctrl.hidebar = true;
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
                angular.copy(todo, $ctrl.todo)
                if (!$ctrl.todo.category) {
                    $ctrl.todo.category = "N/A";
                }
                toDoService.addTodo($ctrl.todo);
                $ctrl.hidebar = false;
            }).catch(function(error) {
                $ctrl.hidebar = false;
                //console.error(error);
            });
        };
    })
