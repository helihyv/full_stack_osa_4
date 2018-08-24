const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  try {
    const body = request.body

    if (!body.title) {
      return response.status(400).json({ error: 'title missing'})
    }

    if (!body.url) {
      return response.status(400).json({ error: 'url missing'})
    }


    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    response.json(savedBlog)
  } catch (expection) {
    console.log(expection)
    response.status(500).json( { error : 'something went wrong...' })
  }
})

module.exports = blogsRouter
