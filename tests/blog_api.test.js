
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./testhelper')



describe('when there are initially some blogs saved', () => {

  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await helper.blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitles = response.body.map(r => r.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })
})

describe('adding a blog', async () => {

  test('POST /api/notes succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'Hunajablogi',
      author: 'Otso Kontio',
      url: 'https://hunajablogi.fi',
      likes: 1000
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const blogsAfterOperation = await helper.blogsInDb()

    const titles = blogsAfterOperation.map (r => r.title)
    const authors = blogsAfterOperation.map(r => r.author)
    const urls = blogsAfterOperation.map(r => r.url)
    const likesList = blogsAfterOperation.map( r => r.likes)

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    expect(titles).toContain('Hunajablogi')
    expect(authors).toContain('Otso Kontio')
    expect(urls).toContain('https://hunajablogi.fi')
    expect(likesList).toContain(1000)
  })

  test('if likes is missing (from POST /api/blogs) it is set to 0', async () => {

    const newBlog = {
      title: 'Kalablogi',
      author: 'Meri Kotka',
      url: 'https://kalablogi.fi'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-type', /application\/json/)

    const id = response.body._id

    const blog = await helper.findBlogInDb(id)

    expect(blog.likes).toBe(0)
  })

  test('if title is missing (from POST /api/blogs) fail and return 400', async () => {
    const newBlog = {
      author: 'Meri Kotka',
      url: 'https://kalablogi.fi',
      likes: 2
    }

    const notesAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const notesAfterOperation = await helper.blogsInDb()

    expect(notesAfterOperation.length).toBe(notesAtStart.length)
  })


  test('if url is missing (from POST /api/blogs) fail and return 400', async () => {
    const newBlog = {
      author: 'Meri Kotka',
      title: 'Kalablogi',
      likes: 3
    }

    const notesAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const notesAfterOperation = await helper.blogsInDb()
    expect(notesAfterOperation.length).toBe(notesAtStart.length)
  })

})

describe('deleting a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'Keksiblogi',
      author: 'Kaija Papu',
      url: 'https://keksiblogi.fi',
      likes: 10
    })
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)

    const blogsAfterOperation = await helper.blogsInDb()

    const titles = blogsAfterOperation.map(r => r.titles)

    expect(titles).not.toContain(addedBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})

describe('updating a blog', async () => {

  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'Rehublogi',
      author: 'Mansikki Ammuton',
      url: 'https://rehublogi.fi',
      likes: 5
    })

    await addedBlog.save()

  })

  test('PUT /api/blogs/:id succeeds with proper statuscode', async () => {
    const changedBlog = new Blog({
      title: 'heinäblogi',
      author: 'Mansikki Ammu',
      url: 'https://heinäblogi.fi',
      likes: 15
    })

    await api
      .put(`/api/blogs/${addedBlog._id}`)
      .send(changedBlog)
      .expect(200)
  
   const changedBlogFromDb = await helper.findBlogInDb(addedBlog._id)
   
   expect(changedBlogFromDb.title).toEqual(changedBlog.title)
   expect(changedBlogFromDb.author).toEqual(changedBlog.author)
   expect(changedBlogFromDb.url).toEqual(changedBlog.url)
   expect(changedBlogFromDb.likes).toEqual(changedBlog.likes)
  })

  test('PUT /api/blogs/:id succeeds when given only the likes field', async () => {
    const justLikesBlog = ({
      likes: 300
    })

    await api
      .put(`/api/blogs/${addedBlog.id}`)
      .send(justLikesBlog)
      .expect(200)

  const changedBlogFromDb = await helper.findBlogInDb(addedBlog._id)

  expect(changedBlogFromDb.likes).toEqual(justLikesBlog.likes)
  expect(changedBlogFromDb.title).toBeDefined()
  expect(changedBlogFromDb.author).toBeDefined()
  expect(changedBlogFromDb.url).toBeDefined()
  })
})

afterAll(() => {
  server.close()
})
