import React from 'react'

const Input = ({ handleInputChange, newInput }) => {
    return (
        <div>
            find countries
            <input onChange={handleInputChange} value={newInput} />
        </div>
    )
}

export default Input