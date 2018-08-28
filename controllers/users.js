const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (!body.username) {
            return response.status(400).json({ error: 'username missing' })
        }

        const existingUser = await User.find({ username: body.username })
        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'username must be unique' })
        }

        if (!body.password) {
            return response.status(400).json({ error: 'password missing' })
        }

        if (body.password.length < 3) {
            return response.status(400).json({ error: 'password must be at least three characters long' })
        }


        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const adult = body.adult === undefined ? true : body.adult
        
        const name = body.name ? body.name : '' //jos nimikenttää ei ole käytetään oletuksena tyhjää merkkijonoa

        const user = new User({
            username: body.username,
            name,
            passwordHash,
            adult
        })

        const savedUser = await user.save()

        response.json(User.format(savedUser))

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...'})
    }
})

usersRouter.get('/', async (request, response) => {
    try {

        const users = await User
            .find({})
            .populate('blogs', {likes: 1, author: 1, title: 1, url: 1})

        response.json(users.map(User.format))

    } catch (exception){
        console.log(exception)
    }
})

module.exports = usersRouter
