var WemoManager = require('./wemoManager.js'),
  manager = new WemoManager('localhost', 5000);


manager.resyncDevices().done(function(data) {
  console.log('devices synced', data);
}).fail(function(err) {
  console.log('there was an error synced', err);
});

function Poller(user) {
  var interval = setInterval(function() {
    manager.getDevices().done(function(data) {
      for (x in data) {

      }
    }).fail(function() {

    });
  }, 60 * 1000);

  this.destroy = function() {
    clearInterval(interval);
  };
}