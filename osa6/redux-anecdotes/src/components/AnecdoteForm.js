import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from './../reducers/anecdoteReducer'
import { setNotification } from './../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  //const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
  
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    props.createAnecdote(content)
    props.setNotification(`you added anecdote '${content}'`, 5)

    //dispatch(createAnecdote(content))
    //dispatch(setNotification(`you added anecdote '${content}'`, 5))
  }

  return (
    <div>
      <h2>Add a new anecdote</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit" > add </button>
      </form>
    </div>
  )
}

const ConnectedAnecdoteForm = connect(null, { createAnecdote, setNotification })(AnecdoteForm)

export default ConnectedAnecdoteForm