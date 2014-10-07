var app = angular.module('FritzbitApp');
app.service('fritzbitService', function ($http) {
    this.getData = function () {
        return $http({method: 'GET', url: 'https://127.0.0.1/fritzbit/data'});
    }

    this.postStepsPerCredit = function (id, ratio) {
        return $http({method: 'POST', url: 'https://127.0.0.1/user/' + id + '/ratio/' + ratio});
    };
});

