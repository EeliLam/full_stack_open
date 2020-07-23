import React from 'react'
import { addLikeTo, removeBlog, addComment } from './../reducers/blogReducer'
import { setNotification } from './../reducers/notificationReducer'
import { useField } from './../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Button, TextField } from '@material-ui/core'

const Blog = ({ blogs }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  const user = useSelector(state => state.user)

  const comment = useField('text')

  if (!blog || !user) {
    return null
  }

  const handleLikeButton = () => dispatch(addLikeTo(blog.id))

  const handleRemoveButton = () => {
    dispatch(removeBlog(blog.id, blog.title, blog.author))
    dispatch(setNotification(`Removed blog ${blog.title} by ${blog.author}`, false, 3))
    history.push('/')
  }

  const handleCommentButton = (e) => {
    e.preventDefault()
    dispatch(addComment(blog.id, comment.value))
    dispatch(setNotification(`Added comment '${comment.value}'`, false, 3))
    comment.reset()
  }

  const marginLeft = { marginLeft: 5 }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        Likes: {blog.likes}
        <Button
          color='primary'
          variant='outlined'
          size='small'
          onClick={handleLikeButton}
        >
          like
        </Button>
      </div>
      <div>Added by: {blog.user.name}</div>
      <div>
        {user.username === blog.user.username
          ? <Button
            onClick={handleRemoveButton}
            color='primary'
            variant='outlined'
            size='small'
            style={marginLeft}
          >
            remove
          </Button>
          : null}
      </div>
      <h3>comments</h3>
      <form onSubmit={handleCommentButton}>
        <TextField label='comment' {...comment.inputProps()} />
        <Button
          color='primary'
          variant='outlined'
          size='small'
        >
          add comment
        </Button>
      </form>
      <ul>
        {blog.comments.map(comment =>
          <li key={uuidv4()}>{comment}</li>
        )}
      </ul>
    </div>
  )
}

export default Blog
