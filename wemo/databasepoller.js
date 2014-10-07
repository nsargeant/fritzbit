var WemoManager = require('./wemoManager.js'),
  manager = new WemoManager('localhost', 5000),
  user = require('../db/user.js');


manager.resyncDevices().done(function(data) {
  console.log('devices synced', data);
}).fail(function(err) {
  console.log('there was an error synced', err);
});

function Poller(user) {
  var interval = setInterval(function() {

    user.getUser(user, function(err, user) {
      if (!user.wemo) {
        user.wemo = {};
        user.wemo.used = 0;
      }
      user.wemo.earned = user.info.sumary.steps / user.website.ratio;
      if (user.wemo.earned <= user.wemo.used) {

        manager.getDevices().done(function(data) {
          for (x in data) {
            manager.toggleDevice(x, 'off').fail(function(err) {
              console.log('oh no there was an error toggling the device');
            });
          }
        }).fail(function(err) {
          console.log('OH NO THERE WAS AN ERROR GETTING DEVICES!', err);
        });
      } else {
        console.log('incrementing used credits from %s to %s', used, used + 1);
        user.wemo.used += 1;
        console.log('saving user to database');

        user.save(function(err, data) {
          if (err) {
            console.log('there was an error saving to the database', err);
          }
        });

        manager.getDevices().done(function(data) {
          for (x in data) {
            manager.toggleDevice(x, 'on').fail(function(err) {
              console.log('oh no there was an error toggling the device');
            });
          }
        }).fail(function(err) {
          console.log('OH NO THERE WAS AN ERROR GETTING DEVICES!', err);
        });
      }
    });
  }, 60 * 1000);
  this.destroy = function() {
    clearInterval(interval);
  };
}

module.exports = Poller;