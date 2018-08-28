const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const error = require('./utils/middleware.js')
const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs',blogsRouter)
app.use('/api/users', usersRouter)


const mongoUrl = config.mongoUrl

mongoose.connect(mongoUrl)
  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

app.use(error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
