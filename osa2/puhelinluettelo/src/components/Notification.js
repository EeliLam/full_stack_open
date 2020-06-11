import React from 'react'

const Notification = ({ msg, error=false }) => {
    if (msg === null) return null

    if (error) {
        return <div className="error">{msg}</div>
    } else {
        return <div className="success">{msg}</div>
    }
    
}

export default Notification