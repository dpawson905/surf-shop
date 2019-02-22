const express = require('express');
const router = express.Router();

// Import middleware
const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware');

// Import controllers
const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile
} = require('../controllers');

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /logout */
router.get('/logout', getLogout)

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile */
router.put('/profile', 
  isLoggedIn, 
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/* GET /forgot-password */
router.get('/forgot-pw', (req, res, next) => {
  res.render('password');
});

/* PUT /forgot-password */
router.put('/forgot-pw', (req, res, next) => {
  res.send('GET /forgot-password')
});

/* GET /reset-password */
router.get('/reset-pw/:token', (req, res, next) => {
  res.send('GET /reset-password/:token')
});

/* PUT /reset-password */
router.put('/reset-pw/:token', (req, res, next) => {
  res.send('PUT /reset-password/:token')
});

module.exports = router;