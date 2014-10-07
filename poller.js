var request = require('request'),
  qs = require('querystring'),
  user = require('./db/user.js'),
  async = require('async');

function Poller() {
  this.timeout = 30000;
  this.users = {};
  this.oauth = {};
}

Poller.prototype.getOauthTokens = function(key, secret, cbUrl, cb) {
  var _this = this;
  _this.oauth = {
    consumer_key: key,
    consumer_secret: secret,
    callback: cbUrl
  }
  var url = 'https://www.fitbit.com/oauth/request_token'
  request.post({
    url: url,
    oauth: _this.oauth
  }, function(e, r, body) {
    if (e) {
      console.log('err:', e);
      cb(e);
    }

    _this.access_token = qs.parse(body);
    //console.log('got access_token:', this.access_token);
    //url = 'https://www.fitbit.com/oauth/authorize?oauth_token=';
    oauth = {
      consumer_key: key,
      consumer_secret: secret,
      token: _this.access_token.oauth_token,
      verifier: _this.access_token.oauth_verifier
    };

    cb(null, oauth);

    //Perm Token
    // request.post({
    //   url: url,
    //   oauth: oauth
    // }, function(e, r, b) {
    //   if (e) {
    //     cb(e);
    //   }
    //   var perm_token = qs.parse(b);
    //   oauth = {
    //     consumer_key: key,
    //     consumer_secret: secret,
    //     token: perm_token.oauth_token,
    //     token_secret: perm_token.oauth_token_secret
    //   },
    //   console.log('Got perm_token:', perm_token);
    //   cb(null, oauth);
    // });
  });
}

Poller.prototype.getUserInfo = function(fitbitId, oauth, cb) {
  request({
    oauth: oauth,
    uri: 'http://api.fitbit.com/1/user/' + fitbitId + '/activities.json',
    method: 'get'
  }, cb);
}

Poller.prototype.start = function(key, secret, cbUrl) {
  var _this = this;
  user.getAllUsers(function(err, users) {
    if (err) {
      console.log(err);
    }
    console.log('got users:', users);
    async.each(users, function(user, cb) {
      console.log('getting oauth tokens for user:', user);
      _this.getOauthTokens(key, secret, cbUrl, function(err, oauth) {
        if (err) {
          console.log(err);
          cb(err);
        }
        user.oauth = oauth;
        cb();
      });
    }, function(err) {
      if (err) {
        console.log(err);
        setInterval(function() {
          async.each(users, function(usr, cbb) {
            _this.getUserInfo(usr.fitbit, usr.oauth, function(err, res, data) {
              console.log(data);
              //user.updateUser(user.fitbit, data)
            });
          }, function(err2) {
            console.log(err2);
          });
        }, _this.timeout)
      }
    });
  });
}
module.exports = new Poller();