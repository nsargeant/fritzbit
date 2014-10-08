var User = require('../db/user.js').User;


User.update({}, {
  info: {
    summary: {
      activityCalories: 400,
      steps: 500
    }

  },
  wemo: {
    used: 0
  }
}, {
  multi: true
}, function(err, data) {
  console.log('response from database', err, data);
});