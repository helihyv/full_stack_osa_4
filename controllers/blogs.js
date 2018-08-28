const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => Blog.format(blog)))
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

    const user = await User.findOne()

    
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
    console.log(expection)
    response.status(500).json( { error : 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
   
    await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()

    } catch (expection) {
      console.log(expection)
      response.status(400).send( { error: "malformatted id" })
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
