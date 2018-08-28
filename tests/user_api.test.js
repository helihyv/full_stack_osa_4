const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./testhelper.js')


describe('When there is already one user at db', async () => {
    beforeAll(async () => {
        await User.remove({})
        const user = new User({ 
            username: 'Otso', 
            password: 'hunaja',
            name: 'Otso Kontio',
            adult: true    
        })

        await user.save()
    })

    test('POST /api/users fails with proper stauscode and message  when no username field is given', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            password: 'kala',
            name: 'Meri Kotka',
            adult: true
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username missing'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

        
    })


    test('POST /api/users fails with proper stauscode and message  when no password field is given', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            username: 'kotka',
            name: 'Meri Kotka',
            adult: true
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'password missing'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

        
    })

    
    test('POST /api/users fails with proper statuscode and message if username already exists', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            username: 'Otso',
            password: 'kala',
            name: 'Meri Kotka',
            adult: true
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

        
    })


    test('POST /api/users fails with proper stauscode and message if password is shorter than three characters', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            username: 'mansikki',
            password: 'ka',
            name: 'Mansikki Ammu',
            adult: true
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'password must be at least three characters long'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

     
    })

    test('POST /api/users succeeds when adult field is missing and uses true as default for adult', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            username: 'mansikki',
            password: 'heinä',
            name: 'Mansikki Ammu',
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)

        const newUser = await User.findById(result.body._id)

        expect(newUser.adult).toBe(true)
    })

    test('POST /api/users succeeds when name field is missing and uses an empty string as default for name', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const userToAdd = {
            username: 'katti',
            password: 'maito',
            adult: false
         
        } 

        const result = await api
            .post('/api/users')
            .send(userToAdd)
            .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)

        const newUser = await User.findById(result.body._id)

        expect(newUser.name).toEqual('')
    })

})

afterAll(() => {
    server.close()
})