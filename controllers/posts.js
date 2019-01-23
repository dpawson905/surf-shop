const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const {
  cloudinary
} = require('../cloudinary');
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_API
});
const mapBoxToken = process.env.MAPBOX_API;
const Post = require('../models/post');

module.exports = {
  // GET all posts /index
  async postIndex(req, res, next) {
    let posts = await Post.paginate({}, {
      page: req.query.page || 1,
      limit: 10,
      sort: '-_id'
    });
    posts.page = Number(posts.page);

    let totalPages = posts.pages;
    let currentPage = posts.page;
    let startPage;
    let endPage;

    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    res.render('posts/index', {
      posts,
      mapBoxToken,
      title: 'Post Index',
      startPage,
      endPage,
      currentPage,
      totalPages
    });
  },

  // GET posts /new
  postNew(req, res, next) {
    res.render('posts/new', {
      title: 'New Post'
    });
  },

  // Posts Create
  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      req.body.post.images.push({
        url: file.secure_url,
        public_id: file.public_id
      });
    }
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1
      })
      .send();
    req.body.post.geometry = response.body.features[0].geometry;
    req.body.post.author = req.user._id;
    let post = new Post(req.body.post);
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
    await post.save();
    req.session.success = 'Post created successfully';
    res.redirect(`/posts/${post.id}`);
  },

  // Post Show
  async postShow(req, res, next) {
    let post = await Post.findById(req.params.id)
      .populate({
        path: 'reviews',
        options: {
          sort: {
            // Show newest review at the top
            '_id': -1
          }
        },
        populate: {
          path: 'author',
          model: 'User'
        }
      });
    let floorRating = post.calculateAvgRating();
    res.render('posts/show', {
      post,
      mapBoxToken,
      floorRating
    })
  },

  // Post Edit
  async postEdit(req, res, next) {
    // pull post from res.locals
    const {
      post
    } = res.locals;
    res.render('posts/edit', {
      post
    });
  },

  // Post Update
  async postUpdate(req, res, next) {
    // pull post from res.locals
    const {
      post
    } = res.locals;
    if (req.body.deleteImages && req.body.deleteImages.length) {
      let deleteImages = req.body.deleteImages;
      for (const public_id of deleteImages) {
        await cloudinary.v2.uploader.destroy(public_id);
        for (const image of post.images) {
          if (image.public_id === public_id) {
            let index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }
    if (req.files) {
      for (const file of req.files) {
        req.body.post.images.push({
          url: file.secure_url,
          public_id: file.public_id
        });
      }
    }
    if (req.body.post.location !== post.location) {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.post.location,
          limit: 1
        })
        .send();
      post.geometry = response.body.features[0].geometry;
      post.location = req.body.post.location;
    }
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
    await post.save();
    req.session.success = 'Post edited successfully';
    res.redirect(`/posts/${post.id}`)
  },

  // Post DESTROY
  async postDestroy(req, res, next) {
    // pull post from res.locals
    const {
      post
    } = res.locals;
    for (const image of post.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await post.remove();
    req.session.success = 'Post deleted successfully';
    res.redirect('/posts');
  }
}