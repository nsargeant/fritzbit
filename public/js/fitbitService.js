var app = angular.module('FritzbitApp');
app.service('fritzbitService', function ($http) {
    this.getData = function () {
        console.log('getData() called!');
        return $http({method: 'GET', url: '/fritzbit/data'});
    }

    this.postStepsPerCredit = function (id, ratio) {
        console.log('postData() called! - id: ', id, ' ratio: ', ratio);
        return $http({method: 'POST', url: '/user/' + id + '/ratio/' + ratio});
    };
});

