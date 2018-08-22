const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const error = require('./utils/middleware.js')


app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs',blogsRouter)

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

app.use(error)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
