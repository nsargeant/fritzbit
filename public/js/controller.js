app.controller('FritzbitController', function ($scope, fritzbitService) {
    $scope.display = {
        credits: 1,
        calories: 599,
        steps: 543,
        distance: 0.5
    };

    $scope.test = function(){
        return 'This is a test';
    };

    $scope.data = {};
    $scope.steps = 0;
    $scope.credits = 0;
    $scope.dirty = false;

    $scope.flipDirty = function() {
        $scope.dirty = true;
    };

    $scope.getData = function() {
        var result = fritzbitService.getData();
        console.dir('getData result: ' + result);
        return result;
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
        $scope.data = $scope.getData();
    }, 1500);
});