app.controller('FritzbitController', function ($scope, fritzbitService) {

    $scope.display = {
        creditsTotal: 0,
        creditsEarned: 0,
        creditsUsed: 0,
        calories: 0,
        stepsTaken: 0,
        steps: 543
    };

    angular.element(document).ready(function () {
        $scope.getUsername();
    });

    $scope.data = {};
    $scope.credits = 0;
    $scope.username = '';
    $scope.creditsEarned = '';
    $scope.wemoState = 'off';
    $scope.wemoButtonMessage = 'Turn on WeMo';

    $scope.getInfo = function () {
        if ($scope.username) {
            fritzbitService.getInfoBlob($scope.username).then(function (data) {
                console.log('data: ', data);
                var dataBlob = data.data;
                $scope.display.steps = dataBlob.website.ratio;
                $scope.display.stepsTaken = dataBlob.info.summary.steps;
                $scope.display.calories = dataBlob.info.summary.activityCalories;
            });
        }
    };

    $scope.getUsername = function () {
        fritzbitService.getUser().then(function (data) {
            $scope.username = data.data.fitbit;
            $scope.getInfo();
        });
    };

    $scope.postStepsPerCredit = function () {
        console.log('$scope.steps in postStepsPerCredit(): ', $scope.display.steps);
        fritzbitService.postStepsPerCredit($scope.username, $scope.display.steps).then(function (data) {
            console.log('post result: ', data);
            $scope.display.creditsEarned = 500;
        });
    };

    $scope.toggleWemo = function() {
        if ($scope.wemoState === 'off') {
            $scope.wemoState = 'on';
            $scope.wemoButtonMessage = 'Turn off WeMo';
        } else {
            $scope.wemoState = 'off';
            $scope.wemoButtonMessage = 'Turn on WeMo';
        }

        fritzbitService.toggleWemo($scope.username,$scope.wemoState).then(function(data){
            console.log('toggleWemo() result: ', data);
        });
    };

    setInterval(function() {
        $scope.display.creditsTotal = $scope.display.creditsEarned = $scope.display.creditsUsed;
    }, 1500);
});