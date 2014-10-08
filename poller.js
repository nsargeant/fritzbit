var request = require('request'),
  qs = require('querystring'),
  user = require('./db/user.js'),
  uuid = require('node-uuid'),
  async = require('async');

var FITBIT_CONSUMER_KEY = "7088513d14a84b16a93e4ab4775036b4";

function Poller(token, tokenSecret) {
  this.timeout = 3000;
  this.users = {};
  this.oauth = {
    consumer_key: FITBIT_CONSUMER_KEY,
    access_token: token,

    // nonce: uuid.v4(),
    // signature: 'Signature calculated as described in The OAuth 1.0 Protocol Section 3.4: Signature.',
    //signature_method: 'HMAC-SHA1',
    //timestamp: new Date(),
    // oauth_version: '1.0'
  };
}

Poller.prototype.getUserInfo = function(id, cb) {
  console.log('Getting user info for ', id);
  request({
    oauth: this.oauth,
    uri: 'http://api.fitbit.com/1/user/' + id + '/activities.json',
    method: 'get'
  }, cb);
}

Poller.prototype.start = function(id) {
  var _this = this;
  _this.getUserInfo(id, function(err, res, data) {
    if (err) {
      console.log('fitbit error!!!!:', err);
    }
    console.log('GOT DATA From fitbit:', data);
  });
  setInterval(function() {
    _this.getUserInfo(id, function(err, res, data) {
      if (err) {
        console.log('fitbit error!!!!:', err);
      }
      console.log('GOT DATA From fitbit:', data);
    });
  }, _this.timeout);
};

module.exports = Poller;