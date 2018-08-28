const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const helper = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => Blog.format(blog)))
})

blogsRouter.post('/', async (request, response) => {

  try {

    const body = request.body

    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid' })
    }

    if (!body.title) {
      return response.status(400).json({ error: 'title missing'})
    }

    if (!body.url) {
      return response.status(400).json({ error: 'url missing'})
    }

    const user = await User.findById(decodedToken.id)

    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
   
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(savedBlog))
  } catch (expection) {
    if (expection.name === 'JsonWebTokenError') {
      response.status(401).json({ error: expection.message })
    } else {
    console.log(expection)
    response.status(500).json( { error : 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {

    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid' })
    }

      
    const blogToBeDeleted = await Blog.findById(request.params.id)

    if (!blogToBeDeleted){ //poistettavaa blogia ei löytynyt
      //oletetaan että blogi oli jo poistettu ja toimitaan kuin poisto ollsi onnistunut
      return response.status(204).end() 
    }
    if (decodedToken.id.toString() !== blogToBeDeleted.user.toString()) {
      return response.status(401).json({ error: 'cannot delete a blog that was created by another user'})
    }

    await blogToBeDeleted.remove()

      response.status(204).end()

    } catch (expection) {
      if (expection.name === 'JsonWebTokenError') {
        response.status(401).json({ error: expection.message })
      } else {
      console.log(expection)
      response.status(400).send( { error: "malformatted id" })
      }
  }
})

blogsRouter.put('/:id', async (request, response) => { //päivittää pyynnössä tulleet kentät ja jättää muut ennalleen
                                                      //mahdolliset ylimääräiset kentät ohitetaan hiljaisesti
                                                      
  try {

    const changesInBlog = {}

    const body = request.body
    
    if (body.title) {
      changesInBlog.title = body.title
    }
    if (body.author) {
      changesInBlog.author = body.author
    }

    if (body.url) {
      changesInBlog.url = body.url
    }

    if (body.likes) {
      changesInBlog.likes = body.likes
    }
    
    console.log (changesInBlog)

    const changedBlog = await Blog.findByIdAndUpdate(request.params.id, changesInBlog, { new: true })

    if(!changedBlog) { //id:llä ei löytynyt blogia
      response.status(400).send( { error: 'no blog with this id exists'})   
    }    
   
    response.json(Blog.format(changedBlog))
    


  } catch (exception) {
    console.log(exception)
    response.status(400).send( { error: 'malformatted id' })
  }
})

module.exports = blogsRouter
