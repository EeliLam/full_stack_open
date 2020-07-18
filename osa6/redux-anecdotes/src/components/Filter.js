import React from 'react'
import { useDispatch } from 'react-redux'
import { changeFilter } from './../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const filterString = event.target.value
    dispatch(changeFilter(filterString))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter