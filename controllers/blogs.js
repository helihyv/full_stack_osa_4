const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  try {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      likes: body.likes || 0,
      url: body.url,
    })

    const savedBlog = await blog.save()
    response.json(savedBlog)
  } catch (expection) {
    console.log(expection)
    response.status(500).json( { error : 'something went wrong...' })
  }
})

module.exports = blogsRouter
