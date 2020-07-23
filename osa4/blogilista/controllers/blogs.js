const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const result = await Blog.find({}).populate('user', { id: 1, username: 1, name: 1 })

  response.json(result)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({ error: 'title missing ' })
  }
  if (!body.url) {
    return response.status(400).json({ error: 'url missing ' })
  }

  if(!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    //console.log('token missing or invalid')
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    //console.log('no user found with provided token')
    return response.status(400).json({ error: 'no user found with provided token' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
    comments: []
  })

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  const result = await blog.save()
  const populatedResult = await result
    .populate('user', { id: 1, username: 1, name: 1 })
    .execPopulate()
  console.log('pop', populatedResult)

  user.blogs = user.blogs.concat(blog)
  await user.save()

  response.status(201).json(populatedResult)
})

blogRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  if(!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    //console.log('token missing or invalid')
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    //console.log('no user found with provided token')
    return response.status(400).json({ error: 'no user found with provided token' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json( { error: 'invalid blog id' })
  }

  blog.comments = [...blog.comments, body.comment]
  const result = await blog.save()
  const populatedResult = await result
    .populate('user', { id: 1, username: 1, name: 1 })
    .execPopulate()

  response.status(201).json(populatedResult)
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const blog = await Blog.findById(request.params.id)
    const user = await User.findById(decodedToken.id)

    if(!blog) {
      return response.status(204).json({ error: 'invalid blog id' })
    }

    if(!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'token corresponds to wrong user' })
    }

    await blog.remove()
    user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id.toString())
    await user.save()

    response.status(204).end()
  } catch(e) { console.log(e) }
})

blogRouter.put('/:id', async (request, response) => {
  if (!request.body.title) {
    return response.status(400).json({ error: 'title missing ' })
  }
  if (!request.body.url) {
    return response.status(400).json({ error: 'url missing ' })
  }

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: request.body.user.id,
    comments: request.body.comments
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { id: 1, username: 1, name: 1 })
    //console.log('updated', updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogRouter