var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

//Connect to the hosted database
connect();

//Connect to mongo
function connect() {
  console.log('connecting to db...');

  var url = 'mongodb://fritzbit:utahtechweek@ds043200.mongolab.com:43200/fritzbit'
  mongoose.connect(url);

  mongoose.connection.on('open', function() {
    console.log('connected to db at:', url);
  });
}