const debug = require('debug')('code-w-node:register');
const User = require('../models/user');

module.exports = {
  // POST register
  async postRegister(req, res, next) {
    debug('Registering User');
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      image: req.body.image
    });
    await User.register(newUser, req.body.password);
    debug('User Created')
    res.redirect('/');
  }

}