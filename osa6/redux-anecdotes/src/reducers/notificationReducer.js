const notificationReducer = (state='', action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return action.data

    case 'REMOVE_NOTIFICATION':
      return ''

    default:
      return state
  }
}

var timeoutID;

export const setNotification = (notification, time) => {
  return dispatch => {
    clearTimeout(timeoutID)
    dispatch({
      type: 'ADD_NOTIFICATION',
      data: notification
    })
    timeoutID = setTimeout(() => 
      dispatch({
        type: 'REMOVE_NOTIFICATION',
      }), time * 1000)
  }
}

/*const addNotification = note => return {
    type: 'ADD_NOTIFICATION',
    data: notification
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}*/

export default notificationReducer