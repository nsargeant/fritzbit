var db = require('./db');

var userSchema = new db.Schema({
  fitbit: String,
  fitbit_token: String,
  fitbit_tokenSecret: String,
  info: Object,
  wemo: Object,
  website: Object
});

var User = db.mongoose.model('User', userSchema);

//Create

/**
 *	#createNewUser
 *
 *	cred: a JSON object with name, and password key value pairs
 *	callback:
 *		- err: Error if one occurs
 *		- user: The newly saved user object
 */
module.exports.findOrCreateNewUser = function(info, callback) {
  var u = new User();
  u.fitbit = info.id;
  u.fitbit_token = info.fitbit_token;
  u.fitbit_tokenSecret = info.fitbit_tokenSecret;
  console.log('looking up user', info);
  User.findOne({
    fitbit: info.id
  }, function(err, user) {
    if (!user) {
      console.log('Saving new user:', u);
      u.save(callback);
    } else
      callback(err, user);
  });
}

//Read
/**
 *	#getAllUsers
 *
 *	callback:
 *		- err: Error if one occurs
 *		- users: An array of User objects as saved in the db
 */
module.exports.getAllUsers = function(callback) {
  User.find(callback);
}

/**
 *	#getUser
 *
 *	id: The id of the user you would like to get
 *	callback:
 *		- err: Error if one occurs
 *		- user: An array of User objects as saved in the db
 */
module.exports.getUser = function(id, callback) {
  User.findOne({
    fitbit: id
  }, callback)
}

//Update

/**
 *	#updateUser
 *
 *	id: The id of the user you would like to update
 *	updates: A JSON object of the key:values to update, (omitted key values are erased)
 *	callback:
 *		- err: Error if one occurs
 */
module.exports.updateUser = function(id, updates, callback) {
  User.update({
    fitbit: id
  }, updates, callback);
}

//Delete
/**
 *	#deleteUser
 *
 *	id: The id of the user you would like to delete
 *	updates: A JSON object of the key:values to update, (omitted key values are erased)
 *	callback:
 *		- err: Error if one occurs
 */
module.exports.deleteUser = function(id, callback) {
  User.remove({
    _id: id
  }, callback);
}