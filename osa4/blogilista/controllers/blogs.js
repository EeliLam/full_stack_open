const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const result = await Blog
        .find({})
        .populate('user', { blogs: 0 })

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
        user: user._id
    })

    if (blog.likes === undefined) {
        blog.likes = 0
    }

    const result = await blog.save()
    user.blogs = user.blogs.concat(blog)
    await user.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if(!blog) {
            return response.status(204).json({ error: 'invalid blog id' })
        }

        if(!request.token) {
            return response.status(401).json({ error: 'token missing' })
        }

        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        if (blog.user.toString() !== decodedToken.id.toString()) {
            return response.status(401).json({ error: 'token corresponds to wrong user' })
        }

        blog.remove()
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
        likes: request.body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogRouter