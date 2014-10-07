app.controller('FritzbitController', function ($scope, fritzbitService) {
    $scope.display = {
        credits: 1,
        calories: 599,
        steps: 543,
        distance: 0.5
    };

    $scope.steps = 0;
    $scope.credits = 0;
    $scope.dirty = false;

    $scope.flipDirty = function() {
        $scope.dirty = true;
    };

    $scope.getData = function() {
        return fritzbitService.getData();
    };

    $scope.postData = function() {
        if ($scope.dirty) {
            if ($scope.credits) {
                fritzbitService.postStepsPerCredit(id,$scope.steps);
            } else {
                fritzbitService.postStepsPerCredit(0);
            }
            $scope.dirty = false;
        }
    };

    setInterval(function(){
        $scope.postData();
    }, 1500);
});