var request = require('request'),
  timeout = 30000,
  user = require('./db/user.js'),
  users = [],
  oauth = {};

function getOauthTokens(key, secret, cbUrl cb) {
  oauth = {
    consumer_key: key,
    consumer_secret: secret,
    callback: cbUrl
  }
  var url = 'https://www.fitbit.com/oauth/authorize?oauth_token='
  request.post({
    url: url,
    oauth: oauth
  }, function(e, r, body) {
    if (e) {
      console.log('err:', e);
      cb(e);
    }
    console.log('res:', r);
    console.log('body:', body);

    var access_token = qs.parse(body);
    url = 'https://www.fitbit.com/oauth/authorize?oauth_token=';
    oauth = {
      consumer_key: key,
      consumer_secret: secret,
      token: access_token.oauth_token,
      verifier: access_token.oauth_verifier
    };

    //Perm Token
    request.post({
      url: url,
      oauth: oauth
    }, function(e, r, body) {

      var perm_token = qs.parse(body);
      oauth = {
        consumer_key: key,
        consumer_secret: secret,
        token: perm_token.oauth_token,
        token_secret: perm_token.oauth_token_secret
      },
      console.log('Got perm_token:', perm_token);
      cb(null, oauth);
    });
  });
}

function getUserInfo(fitbitId, oauth, cb) {
  request({
    oauth: oauth,
    uri: 'http://api.fitbit.com/1/user/' + fitbitId + '/activities.json',
    method: 'get'
  }, cb);
}

function saveUser(argument) {
  // body...
}

module.exports.start = function(key, secret, cbUrl) {
  user.getAllUsers(function(err, usrs) {
    if (err) {
      console.log(err);
    }
    users = usrs;
    async.each(users, function(user, cb) {
      getOauthTokens(key, secret, cbUrl, function(err, oauth) {
        if (err) {
          cb(err);
        }
        setInterval(function() {
          getUserInfo(user.)
        }, timeout);
      });

    }, function(err) {
      if (err) {
        console.log(err)
      }
    });
  });
}