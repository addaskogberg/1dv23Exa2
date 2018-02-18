/**
 * ref
 * https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
 /*    bcrypt = require(bcrypt),
    SALT_WORK_FACTOR = 10; */

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true }
})

const User = mongoose.model('User', userSchema)

// module.exports = mongoose.model(User&, UserSchema);
module.exports = User
