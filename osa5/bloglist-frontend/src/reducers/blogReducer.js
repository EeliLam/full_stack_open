const blogReducer = (state=[], action) => {
  switch (action.type) {
  case 'SET_BLOGS':
    return action.data

  default:
    return state
  }
}

export const setBlogs = (blogs) => {
  return dispatch => {
    dispatch({
      type: 'SET_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer