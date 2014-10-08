var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  ip = require('ip'),
  user = require('./db/user.js'),
  Poll = require('./poller.js'),
  FitbitStrategy = require('passport-fitbit').Strategy;

var port = 3000;
var FITBIT_CONSUMER_KEY = "7088513d14a84b16a93e4ab4775036b4";
var FITBIT_CONSUMER_SECRET = "1bec8db9c979486995307146559fe649";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Fitbit profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  //console.log('serializeUser:', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //console.log('deserializeUser:', user);
  done(null, obj);
});


// Use the FitbitStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Fitbit profile), and
//   invoke a callback with a user object.
passport.use(new FitbitStrategy({
    consumerKey: FITBIT_CONSUMER_KEY,
    consumerSecret: FITBIT_CONSUMER_SECRET,
    callbackURL: 'http://' + ip.address() + ':3000/auth/fitbit/callback'
  },
  function(token, tokenSecret, profile, done) {

    profile.fitbit_token = token
    profile.fitbit_tokenSecret = tokenSecret;
    user.findOrCreateNewUser(profile, function(err, user) {
      var poll = new Poll(user.fitbit_token);
      poll.start(user.fitbit);
      return done(err, user);
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'keyboard cat'
  }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res) {
  console.log('In / !!!!')
  if (!req.user) {

    res.send('<!DOCTYPE html><html><head><title>Fritzbit</title>' +
      '</head><body><a href="/auth/fitbit">Login</a></body></html>')
  } else {
    res.redirect('/index.html');
  }
});

app.get('/account', ensureAuthenticated, function(req, res) {
  console.log('In /account !!!!')
  res.render('account', {
    user: req.user
  });
});

app.get('/login', function(req, res) {
  console.log('In /login !!!!')

  res.render('login', {
    user: req.user
  });
});

app.get('/fritzbit/data', function(req, res, next) {
  console.log(req.user);
  res.send(200, req.user);
});

app.get('/user/:user', function(req, res, next) {
  var U = user.User;
  U.findOne({
    fitbit: req.params.user
  }, function(err, data) {
    res.send(200, data);
  });
});

app.post('/user/:id/ratio/:ratio', function(req, res, next) {
  console.log('adding ratio to user');
  user.getUser(req.params.id, function(err, use) {
    if (err) {
      res.send(500, err);
    } else {

      var U = user.User;

      U.update({
        fitbit: use.fitbit
      }, {
        website: {
          ratio: req.params.ratio
        }
      }, {}, function(err, data) {
        if (err) {
          console.log('error saving to database', err);
          res.send(500, err);
        } else {
          console.log('Saved data! ####################', data);
          res.send(data);
        }
      });
    }
  });

});

// GET /auth/fitbit
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Fitbit authentication will involve redirecting
//   the user to fitbit.com.  After authorization, Fitbit will redirect the user
//   back to this application at /auth/fitbit/callback
app.get('/auth/fitbit', function(req, res, next) {
    console.log('we are going to get here');
    next();
  },
  passport.authenticate('fitbit'), function(req, res, next) {
    console.log('we got here');
    // The request will be redirected to Fitbit for authentication, so this
    // function will not be called.
    next();
  });

// GET /auth/fitbit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/fitbit/callback',
  passport.authenticate('fitbit', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    console.log('============ we are here= ===========');
    console.log(req.user);
    console.log('============ we are here= ===========');
    res.redirect('/index.html');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(port);

console.log('listening @: http://' + ip.address() + ':' + port);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}