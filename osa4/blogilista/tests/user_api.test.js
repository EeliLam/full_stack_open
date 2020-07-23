const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('When there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'myUser',
      name: 'myName',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Creation fails with existing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: usersAtStart[0].username,
      name: 'myName',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
  })

  test('Creation fails without username and/or password', async () => {
    let result = await api
      .post('/api/users')
      .send({ username: 'myUsername' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing')

    result = await api
      .post('/api/users')
      .send({ password: 'myPassword' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username missing')
  })

  test('Creation fails with too short password', async () => {
    let result = await api
      .post('/api/users')
      .send({ username: 'myUsername', name: 'myName', password: 'ab' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short')
  })
})

afterAll(() => {
  mongoose.connection.close()
})