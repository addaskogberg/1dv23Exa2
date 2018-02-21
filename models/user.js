/**
 * model for schemas in mongodb
 * author Adda Skogberg
 * ref
 * https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
 // user schema for mongodb
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

// password schema for mongodb
userSchema.methods.comparePassword = function (candidatePassword) {
  if (candidatePassword === this.password) {
    return true
  } else {
    return false
  }
}

const User = mongoose.model('User', userSchema)

// module.exports = mongoose.model(User&, UserSchema);
module.exports = User
