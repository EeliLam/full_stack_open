import React, { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, addedByCurrentUser }) => {
  const [showFullInfo, setShowFullInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenFullInfo = { display: showFullInfo ? 'none' : '' }
  const showWhenFullInfo = { display: showFullInfo ? '' : 'none' }

  const toggleFullInfo = () => {
    setShowFullInfo(!showFullInfo)
  }

  return (
    <div>
      <div style={{ ...blogStyle, ...hideWhenFullInfo }} id='partialInfo'>
        {blog.title} {blog.author}
        <button onClick={toggleFullInfo}>view</button>
      </div>
      <div style={{ ...blogStyle, ...showWhenFullInfo }} id='fullInfo'>
        <div>Title: {blog.title} <button onClick={toggleFullInfo}>hide</button></div>
        <div>Author: {blog.author}</div>
        <div>Url: {blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={addLike}>like</button></div>
        <div>Added by: {blog.user.name}</div>
        <div>
          {addedByCurrentUser
            ? <button onClick={removeBlog}>remove</button>
            : ''}
        </div>
      </div>
    </div>
  )
}

export default Blog
