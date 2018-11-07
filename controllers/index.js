const debug = require('debug')('code-w-node:register');
const User = require('../models/user');

module.exports = {
  // POST register
  postRegister(req, res, next) {
    debug('Registering User');
    User.register(new User({
      username: req.body.username
    }), req.body.password, (err) => {
      if(err) {
        debug('ERROR WHILE REGISTERING USER', err)
        return next(err);
      }
      debug('User registered!')
      res.redirect('/')
    })
  }
}