const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return (
    blogs
      .map(b => b.likes)
      .reduce((a,b) => a+b, 0)
  )
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((a,b) => a.likes > b.likes ? a : b, {})
  return (
    {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    }
  )
}

const mostBlogs = (blogs) => {
  const blogCounts = Object.entries(
    lodash.countBy(blogs, (blog) => blog.author)
  )
  const res = blogCounts.reduce((a,b) => a[1] > b[1] ? a : b, [])
  return (
    {
      author: res[0],
      blogs: res[1]
    }
  )
}

const mostLikes = (blogs) => {
  const likeCounts = Object.entries(
    lodash.groupBy(blogs, (blog) => blog.author)
  )
  const res = likeCounts
    .map(([author, blogs]) => [author, totalLikes(blogs)])
    .reduce((a,b) => a[1] > b[1] ? a : b, [])
  return (
    {
      author: res[0],
      likes: res[1]
    }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}