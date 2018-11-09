const express = require('express');
const router = express.Router();

// load middleware
const { 
  errorHandler 
} = require('../middleware');

// load controllers
const { 
  getPosts,
  newPost,
  createPost,
  showPost,
  editPost
} = require('../controllers/posts');

/* GET posts index /posts */
router.get('/', errorHandler(getPosts));

/* GET posts new /posts/new */
router.get('/new', newPost);

/* POST posts create /posts */
router.post('/', errorHandler(createPost));

/* GET posts show /posts/:id */
router.get('/:id', errorHandler(showPost));

/* GET posts edit /posts/:id/edit */
router.get('/:id/edit', errorHandler(editPost));

/* PUT posts edit /posts/:id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /posts/:id')
});

/* DELETE posts edit /posts/:id */
router.delete('/id', (req, res, next) => {
  res.send('DELETE /posts/:id')
});

module.exports = router;