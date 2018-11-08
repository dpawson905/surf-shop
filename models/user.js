const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  image: String,
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

UserSchema.plugin(passportLocalMongoose, {
  lastLoginField: true
});
module.exports = mongoose.model('User', UserSchema);