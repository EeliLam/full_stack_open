import userService from './../services/users'

const userlistReducer = (state=[], action) => {
  switch (action.type) {
  case 'SET_USERS':
    return action.data

  default:
    return state
  }
}

export const getAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'SET_USERS',
      data: users
    })
  }
}

export default userlistReducer