app.controller('FritzbitController', function ($scope, fritzbitService) {
    $scope.display = {
        credits: 1,
        calories: 599,
        steps: 543,
        distance: 0.5
    };

    $scope.test = function () {
        return 'This is a test';
    };

    $scope.data = {};
    $scope.steps = 0;
    $scope.credits = 0;
    $scope.dirty = false;
    $scope.username = '';

    $scope.flipDirty = function () {
        console.log('It\'s dirty');
        $scope.dirty = true;
    };

    $scope.flipClean = function () {
        console.log('It\'s clean!');
        $scope.dirty = false;
    };

    $scope.getUsername = function () {
        fritzbitService.getData().then(function (data) {
            console.log('getData result: ', data);
            $scope.username = data.data.fitbit;
            console.log('username: ', $scope.username);
            $scope.flipDirty();
        });
    };

    $scope.postData = function () {
        if ($scope.dirty) {
            fritzbitService.postStepsPerCredit($scope.username,$scope.steps).then(function(data){
                console.log('post result: ', data);
            });
            $scope.flipClean();
        }
    };

    setInterval(function () {
        if (!$scope.username) {
            $scope.getUsername();
        } else {
            //$scope.postData();
        }
    }, 1500);
});