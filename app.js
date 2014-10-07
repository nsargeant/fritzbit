var express = require('express');

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser('sess'));

var PORT = 3333;
var key = '7088513d14a84b16a93e4ab4775036b4';
var secret = '1bec8db9c979486995307146559fe649';
var url = 'http://localhost:' + PORT;
var fitbitClient = require('fitbit-js')(key, secret, url);

var token;
app.get('/', function(req, res) {
  fitbitClient.getAccessToken(req, res, function(error, newToken) {
    if (error) {
      console.log('there was an error!');
    }
    if (newToken) {
      console.log('got a token');
      token = newToken;
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end('<html>Now <a href="/getStuff">get stuff</a></html>');
    }
  });
});

app.get('/getStuff', function(req, res) {
  fitbitClient.apiCall('GET', '/user/-/activities/date/2011-05-25.json', {
      token: {
        oauth_token_secret: token.oauth_token_secret,
        oauth_token: token.oauth_token
      }
    },
    function(err, resp, json) {
      if (err) return res.send(err, 500);
      res.json(json);
    });
});

app.get('/cookie', function(req, res) {
  res.send('wahoo!');
});


app.listen(PORT);
console.log('listening at http://localhost:' + PORT + '/');