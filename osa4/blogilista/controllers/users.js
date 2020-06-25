const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs')
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.username) {
        return response.status(400).json({ error: 'username missing' })
    }
    if (!body.password) {
        return response.status(400).json({ error: 'password missing' })
    }
    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password too short (under 3 characters)' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs: []
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = userRouter