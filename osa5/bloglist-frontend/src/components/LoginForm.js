import React from 'react'
import { login } from './../reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useField } from './../hooks/index'
import { TextField, Button } from '@material-ui/core'

const LoginForm = () => {

  const username = useField('text')
  const password = useField('password')

  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(login(username.value, password.value))
    username.reset()
    password.reset()
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField label='username' {...username.inputProps()} />
        </div>
        <div>
          <TextField label='password' {...password.inputProps()} />
        </div>
        <div>
          <Button variant='contained' color='primary' type='submit'>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm