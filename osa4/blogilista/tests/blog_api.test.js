const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

//jest.useFakeTimers()

beforeEach(async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send(helper.initialUser)
    .expect(200)

  const token = await helper.login()

  await Blog.deleteMany({})

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(helper.initialBlogs[0])
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(helper.initialBlogs[1])
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

describe('With some initial blogs in db', () => {
  test('HTTP GET returns blogs in JSON form', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('Blog IDs exist', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('When adding a new blog', () => {

  test('A valid blog can be added', async () => {

    const token = await helper.login()

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogs.map(r => r.title)
    expect(titles).toContain(helper.newBlog.title)
  })

  test('Likes default to 0', async () => {

    const token = await helper.login()

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send({ ...helper.newBlog, likes: undefined })
      .expect(201)

    const blogs = await helper.blogsInDb()
    const addedBlog = blogs[helper.initialBlogs.length]
    expect(addedBlog.likes).toBeDefined()
    expect(addedBlog.likes).toEqual(0)
  })

  test('A blog without title and/or url evokes statuscode 400', async () => {

    const token = await helper.login()

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send({ ...helper.newBlog, title: undefined })
      .expect(400)

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send({ ...helper.newBlog, url: undefined })
      .expect(400)

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)
  })

  test('A request without token fails with statuscode 401', async () => {

    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(401)

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Removing a blog', () => {
  test('With existing ID and correct token correctly removes the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[0].id
    const token = await helper.login()

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', token)
      .expect(204)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length - 1)
    expect(blogs.map(b => b.id)).not.toContain(id)
  })

  test('With existing ID but without token doesnt remove the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const id = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .expect(401)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
    expect(blogs.map(b => b.id)).toContain(id)
  })

  test('With non-existing ID and correct token doesnt remove the blog', async () => {
    const id = await helper.nonExistingId()
    const token = await helper.login()

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', token)
      .expect(204)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
    expect(blogs.map(b => b.id)).not.toContain(id)
  })
})

describe('Modifying a blog', () => {
  test('With existing ID correctly modifies the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const modifiedBlog = { ...blogsAtStart[0], title: 'modifiedTitle' }
    const id = modifiedBlog.id
    await api
      .put(`/api/blogs/${id}`)
      .send(modifiedBlog)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
    expect(blogs[0].id).toEqual(id)
    expect(blogs[0].title).toEqual('modifiedTitle')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
