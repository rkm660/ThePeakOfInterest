var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    userID: { type: String, unique: true, index: true },
    token: String,
    email: String,
    first_name: String,
    last_name: String
});

module.exports = mongoose.model('User', UserSchema);
