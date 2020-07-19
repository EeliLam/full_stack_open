const notificationReducer = (state=null, action) => {
  switch (action.type) {
  case 'ADD_NOTIFICATION':
    return action.data

  case 'REMOVE_NOTIFICATION':
    return null

  default:
    return state
  }
}

var timeoutID

export const setNotification = (notification, isError, time) => {
  return dispatch => {
    clearTimeout(timeoutID)
    dispatch({
      type: 'ADD_NOTIFICATION',
      data: { msg: notification, isError }
    })
    timeoutID = setTimeout(() =>
      dispatch({
        type: 'REMOVE_NOTIFICATION',
      }), time * 1000)
  }
}

export default notificationReducer