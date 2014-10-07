var user = require('./user.js').User;

// user.findOne({ fitbit: '2X4KKM'}, function(err, us) {
//   console.log('error?', err);

//   us.website.ratio = 500;



//   us.save(function(er, use) {
//     console.log('save error?', er);
//     console.log(use);
//   });
// });

// var u = new user();

// u.fitbit = '2X4KKM';
// u.website.ratio = 500;

// u.save(function(err, data) {
//   console.log('this is a test', err, data);
// });

user.update({
  fitbit: '2X4KKM'
}, {
  website: {
    ratio: 500
  }
}, {}, function(err, data) {
  console.log('this is a test', err, data);
});