const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'myTitle',
    author: 'myAuthor',
    url: 'myUrl',
    likes: 3,
  },
  {
    title: 'myTitle2',
    author: 'myAuthor2',
    url: 'myUrl2',
    likes: 6,
  }
]

const newBlog = {
  title: 'newTitle',
  author: 'newAuthor',
  url: 'newUrl'
}

const initialUser = {
  username: 'myUser',
  name: 'myName',
  password: 'myPassword'
}

const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15VXNlciIsImlkIjoiNWVmNDdjMGViNTQ3YzMyNmY3NmU5MzdhIiwiaWF0IjoxNTkzMDg0OTAyfQ.-iIJtgMvFjE0ZvAHqZCYwfs2PiUkXnX67s1f72WS0ec'

const nonExistingId = async () => {
  const blog = new Blog({ title: '', author: '', url: '' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const login = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: initialUser.username,
      password: initialUser.password
    })
  const token = `bearer ${response.body.token}`
  return token
}

module.exports = {
  initialBlogs,
  newBlog,
  initialUser,
  token,
  nonExistingId,
  blogsInDb,
  usersInDb,
  login
}