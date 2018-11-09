const Post = require('../models/post');

module.exports = {
  // GET all posts /index
  async postIndex(req, res, next) {
    let posts = await Post.find({});
    res.render('posts/index', { posts })
  },

  // GET posts /new
  postNew(req, res, next) {
    res.render('posts/new');
  },

  // Posts Create
  async postCreate(req, res, next) {
    let post = await Post.create(req.body.post);
    res.redirect(`/posts/${post.id}`);
  },

  // Post Show
  async postShow(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render('posts/show', { post })
  },

  // Post Edit
  async postEdit(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  },

  // Post Update
  async postUpdate(req, res, next) {
    let post = await Post.findOneAndUpdate(
      req.params.id, 
      req.body.post, 
      {
        new: true
      }
  );
    res.redirect(`/posts/${post.id}`)
  }
}