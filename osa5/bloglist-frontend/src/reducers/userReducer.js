import loginService from './../services/login'
import blogService from './../services/blogs'
import { setNotification } from './notificationReducer'

const userReducer = (state=null, action) => {
  switch (action.type){
  case 'SET_USER':
    return action.data
  case 'REMOVE_USER':
    return null

  default:
    return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER',
        data: user
      })
      dispatch(setNotification(`${username} logged in`, false, 3))
    } catch(e) {
      console.log('login error', e)
      dispatch(setNotification('Wrong username/password', true, 3))
    }
  }
}

export const loginUserFromLocalStorage = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER',
        data: user
      })
    }
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedUser')
    dispatch({
      type: 'REMOVE_USER'
    })
  }
}

export default userReducer