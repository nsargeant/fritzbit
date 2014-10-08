var WemoManager = require('./wemoManager.js'),
  manager = new WemoManager('localhost', 5000),
  user = require('../db/user.js');


manager.resyncDevices().done(function(data) {
  console.log('devices synced', data);
}).fail(function(err) {
  console.log('there was an error synced', err);
});

function Poller(use) {
  var _this = this;

  manager.getDevices().done(function(data) {
    for (x in data) {
      if (x === "jive2-wemo-tv") {
        manager.toggleDevice(x, 'on').fail(function(err) {
          console.log('oh no there was an error toggling the device');
        });
      }
    }
  }).fail(function(err) {
    console.log('OH NO THERE WAS AN ERROR GETTING DEVICES!', err);
  });

  var interval = setInterval(function() {
    user.getUser(use, function(err, u) {
      if (!u.wemo) {
        console.log('resetting wemo object');
        u.wemo = {};
        u.wemo.used = 0;
      }
      u.wemo.earned = u.info.summary.steps / u.website.ratio;
      console.log('sats', u.wemo.earned, u.wemo.used);
      if (u.wemo.earned <= u.wemo.used) {

        _this.destroy();

      } else {
        console.log('incrementing used credits from %s to %s', u.wemo.used, u.wemo.used + 1);
        u.wemo.used += 1;
        console.log('saving user to database');

        var updater = {
          fitbit: u.fitbit,
          info: u.info,
          website: u.website,
          wemo: u.wemo
        };

        console.log('db object', updater);

        user.User.update({
          fitbit: use
        }, updater, {}, function(err, data) {
          if (err) {
            console.log('there was an error saving to the database', err);
          } else {
            console.log('saved', data);
          }
        });

        manager.getDevices().done(function(data) {
          for (x in data) {
            if (x === "jive2-wemo-tv") {
              manager.toggleDevice(x, 'on').fail(function(err) {
                console.log('oh no there was an error toggling the device');
              });
            }
          }
        }).fail(function(err) {
          console.log('OH NO THERE WAS AN ERROR GETTING DEVICES!', err);
        });
      }
    });
  }, 10 * 1000);
  this.destroy = function() {
    manager.getDevices().done(function(d) {
      console.log('devices to shut down', d, typeof d);
      for (var x in d) {
        console.log(x);
        if (x === 'jive2-wemo-tv') {
          manager.toggleDevice(x, 'off').fail(function(err) {
            console.log('oh no there was an error toggling the device');
          }).done(function() {
            console.log('turnned off the wemo!');
            _this.destroy();
          });
        }
      }
    }).fail(function(err) {
      console.log('OH NO THERE WAS AN ERROR GETTING DEVICES!', err);
    });
    console.log('destroying countdown');
    clearInterval(interval);
  };
}

module.exports = Poller;