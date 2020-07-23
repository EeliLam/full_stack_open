import React from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from './../reducers/blogReducer'
import { setNotification } from './../reducers/notificationReducer'
import { useField } from './../hooks/index'
import { TextField, Button } from '@material-ui/core'

const CreateBlogForm = ({ toggleRef }) => {

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    toggleRef.current.toggleVisibility()
    dispatch(createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    }))

    dispatch(setNotification(`A new blog: '${title.value}' by ${author.value} added`, false, 3))

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label='title'
            {...title.inputProps()}
            id='title'
          />
        </div>
        <div>
          <TextField
            label='author'
            {...author.inputProps()}
            id='author'
          />
        </div>
        <div>
          <TextField
            label='url'
            {...url.inputProps()}
            id='url'
          />
        </div>
        <Button size='small' variant='outlined' color='primary' type='submit'>save</Button>
      </form>
    </div>
  )
}

export default CreateBlogForm