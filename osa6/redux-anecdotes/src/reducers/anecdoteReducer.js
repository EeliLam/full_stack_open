import anecdoteService from './../services/anecdotes'

/*const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}*/

/*export const voteAction = (id) => {
  return {
    type: 'VOTE',
    data: {
      id
    }
  }
}*/

export const voteAnecdote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    const votedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes+1
    }
    const response = await anecdoteService.modify(votedAnecdote)
    dispatch({
      type: 'MODIFY_ANECDOTE',
      data: response
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch({
        type: 'NEW_ANECDOTE',
        data: anecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const anecdoteReducer = (state = [], action) => {

  switch (action.type) {
    case 'MODIFY_ANECDOTE':
      const id = action.data.id
      const anecdote = action.data

      return (
        state
          .map(a => 
          a.id === id ?
          anecdote :
          a
          )
          .sort((a,b) => b.votes - a.votes)
      )

    case 'NEW_ANECDOTE':
      return [...state, action.data]

    case 'INIT_ANECDOTES':
      return action.data

    default:
      return state
  }
}

export default anecdoteReducer