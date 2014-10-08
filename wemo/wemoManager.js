var request = require('request'),
  p = require('jpromise');

function Manager(host, port) {

  var _this = this;

  _this.resyncDevices = function(dfd) {
    dfd = dfd || new p();
    request.post("http://" + host + ":" + port + "/api/environment", function(err, resp, body) {
      if (err) {
        dfd.reject(err);
      } else {
        dfd.resolve(resp.body);
      }
    });
    return dfd.promise();
  };

  _this.getDevices = function(dfd) {
    dfd = dfd || new p();
    request.get("http://" + host + ":" + port + "/api/environment", function(err, resp, body) {
      if (err) {
        dfd.reject(err);
      } else {
        console.log('devices', resp.body);
        dfd.resolve(JSON.parse(resp.body));
      }
    });
    return dfd.promise();
  };

  _this.getDevice = function(name, dfd) {
    dfd = dfd || new p();
    request.get("http://" + host + ":" + port + "/api/device/" + name, function(err, resp, body) {
      if (err) {
        dfd.reject(err);
      } else {
        dfd.resolve(resp.body);
      }
    });
    return dfd.promise();
  };

  _this.toggleDevice = function(name, state, dfd) {
    dfd = dfd || new p();

    var query = "";
    if (state) {
      query = "?state=" + state;
    }

    request.post("http://" + host + ":" + port + "/api/device/" + name + query, function(err, resp, body) {
      if (err) {
        dfd.reject(err);
      } else {
        dfd.resolve(resp.body);
      }
    });
    return dfd.promise();
  };

  return _this;
}

module.exports = Manager;