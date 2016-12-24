angular.module("myApp")
    .controller('ModalInstanceCtrl', function($templateCache, $uibModalInstance, mainFactory) {

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
