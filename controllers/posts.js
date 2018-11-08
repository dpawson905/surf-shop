const Post = require('../models/post');

module.exports = {
  // GET all posts /index
  async getPosts(req, res, next) {
    let posts = await Post.find({});
    res.render('posts/index', { posts })
  },

  // GET posts /new
  newPost(req, res, next) {
    res.render('posts/new');
  },

  // Posts Create
  async createPost(req, res, next) {
    let post = await Post.create(req.body);
    res.redirect(`/posts/${post.id}`);
  }
}