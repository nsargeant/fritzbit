var app = angular.module('FritzbitApp');
app.service('fritzbitService', function ($http) {
    this.getData = function () {
        console.log('getData() called!');
        return $http({method: 'GET', url: '/fritzbit/data'});
    }

    this.postStepsPerCredit = function (id, ratio) {
        console.log('postData() called!');
        return $http({method: 'POST', url: 'https://127.0.0.1/user/' + id + '/ratio/' + ratio});
    };
});

