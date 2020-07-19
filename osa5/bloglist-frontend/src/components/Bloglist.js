import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, addLikeTo, removeBlog, currentUsername }) => {
  blogs.sort((a,b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLikeTo(blog.id)}
          removeBlog={() => removeBlog(blog.id)}
          addedByCurrentUser={blog.user.username === currentUsername}
        />
      )}
    </div>
  )
}

export default BlogList