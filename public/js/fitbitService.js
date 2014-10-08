var app = angular.module('FritzbitApp');
app.service('fritzbitService', function ($http) {
    this.getUser = function () {
        console.log('getUser() called!');
        return $http({method: 'GET', url: '/fritzbit/data'});
    };

    this.getInfoBlob = function (id) {
        console.log('getInfoBlob() called!');
        return $http({method: 'GET', url: '/user/' + id});
    };

    this.postStepsPerCredit = function (id, ratio) {
        console.log('postStepsPerCredit() called! - id: ', id, ' ratio: ', ratio);
        return $http({method: 'POST', url: '/user/' + id + '/ratio/' + ratio});
    };

    this.toggleWemo = function (id, state) {
        console.log('in toggleWemo()');
        return $http({method: 'POST', url: '/wemo/' + id + '/'+ state});
    };
});

