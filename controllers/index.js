const debug = require('debug')('code-w-node:register');
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');

const mapBoxToken = process.env.MAPBOX_API;

module.exports = {
  // GET / 
  async landingPage(req, res, next) {
    const posts = await Post.find({});
    res.render('index', { posts, mapBoxToken, title: 'Surf Shop - Home' });
  },

  // POST /register
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
  },

  // POST /login
  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
      // successFlash: true,
      // failureFlash: true
    })(req, res, next);
  },

  // GET /logout
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/')
  }

}