const Blog = require('../models/blog')
const User = require( '../models/user')

const initialBlogs = [
  {
    title: 'Luublogi',
    author: 'Musti Hauva',
    url: 'https://luublogi.fi',
    likes: 0
  },
  {
    title: 'Juustoblogi',
    author: 'Kraakku Korppi',
    url: 'https://juustoblogi.fi',
    likes: 2
  },
  {
    title: 'Hirviblogi',
    author: 'Susi Hukkanen',
    url: 'https://hirviblogi.fi',
    likes: 4
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const findBlogInDb = async (id) => {
  const blog = await Blog.findById(id)
  return blog
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  blogsInDb,
  initialBlogs,
  findBlogInDb,
  usersInDb
}
