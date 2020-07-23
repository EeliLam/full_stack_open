import blogService from './../services/blogs'

const blogReducer = (state=[], action) => {
  switch (action.type) {
  case 'SET_BLOGS':
    return action.data
  case 'ADD_BLOG':
    return state.concat(action.data)
  case 'MODIFY_BLOG': {
    const id = action.data.id
    const blog = action.data

    return state
      .map(b => b.id === id ? blog : b)
      .sort((a,b) => b.likes - a.likes)
  }
  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.data)

  default:
    return state
  }
}

export const updateBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'SET_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blogObject) => {
  return async dispatch => {
    try {
      console.log('Creating new blog')
      const response = await blogService.postNew(blogObject)
      console.log(response)
      dispatch({
        type: 'ADD_BLOG',
        data: response
      })
    } catch(e) {
      console.log('blog creation error', e)
    }
  }
}

export const addLikeTo = (id) => {
  return async (dispatch, getState) => {
    const blogs = getState().blogs
    console.log('blo', blogs, id)
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes+1 }
    console.log('all blogs', blogs)
    console.log('addliketo', changedBlog)

    try {
      const returnedBlog = await blogService.modifyBlog(id, changedBlog)
      dispatch({
        type: 'MODIFY_BLOG',
        data: returnedBlog
      })
    } catch(exception) {
      console.log('exception', exception)
    }
  }
}

export const removeBlog = (id, title, author) => {
  return async dispatch => {
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        await blogService.deleteBlog(id)
        dispatch({
          type: 'REMOVE_BLOG',
          data: id
        })
      }
    } catch(exception) {
      console.log(exception)
    }
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    const returnedBlog = await blogService.addComment(id, comment)
    console.log(returnedBlog)
    dispatch({
      type: 'MODIFY_BLOG',
      data: returnedBlog
    })
  }
}

export default blogReducer