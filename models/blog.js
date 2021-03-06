const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = (blog) => {

  return {
    _id: blog._id,
    user: blog.user,
    likes: blog.likes,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
