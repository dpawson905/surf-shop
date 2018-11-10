const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
  // Review Create
  async reviewCreate(req, res, next) {
    // find post by its id
    let post = await Post.findById(req.params.id).populate('reviews').exec();
    let haveReviewed = post.reviews.filter(review => {
      return review.author.equals(req.user._id);
    }).length;
    if(haveReviewed) {
      req.session.error = "Sorry, you can only create one review per post. Please edit your previous review."
      return res.redirect(`/posts/${post.id}`);
    }
    // create review
    req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    // assign review to post
    post.reviews.push(review)
    // save the post
    await post.save();
    // redirect to the post
    req.session.success = 'Review created successfully';
    res.redirect(`/posts/${post.id}`);
  },

  // Review Update
  async reviewUpdate(req, res, next) {
    await Review.findOneAndUpdate(req.params.review_id, req.body.review, {new: true});
    req.session.success = 'Review updated successfully';
    res.redirect(`/posts/${req.params.id}`);
  },

  // Review DESTROY
  async reviewDestroy(req, res, next) {
    await Post.findOneAndUpdate(req.params.id, {
      $pull: { reviews: req.params.review_id}
    });
    await Review.findOneAndDelete(req.params.review_id);
    req.session.success = 'Review deleted successfully';
    res.redirect(`/posts/${req.params.id}`);
  }
}