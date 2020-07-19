import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (notification === null) return null

  if (notification.isError) {
    return <div className="error">{notification.msg}</div>
  } else {
    return <div className="success">{notification.msg}</div>
  }

}

export default Notification