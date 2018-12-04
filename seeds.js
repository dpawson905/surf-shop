const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
  await Post.remove({});
  for(const i of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      author: {
        '_id': '5be3830fecccf147ccf72185',
        'username': 'dpawson905'
      }
    }
    await Post.create(post);
  }
  console.log('New Posts created');
}

module.exports = seedPosts;