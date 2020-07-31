import React, { useEffect } from 'react'
import { useField } from './../hooks/index'
import { useMutation } from '@apollo/client'
import { LOGIN } from './../queries'

const Login = (props) => {
  const username = useField('text')
  const password = useField('password')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('login', username.value, password.value)
    try {
      login({
        variables: { username: username.value, password: password.value }
      })
      props.setPage('authors')
      username.reset()
      password.reset()
    } catch(error) {
      console.log('login error', error)
    }
    
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input {...username.inputProps()} />
        </div>
        <div>
          password
          <input {...password.inputProps()} />
        </div>
        <button>login</button>
      </form>
    </div>
  )
}

export default Login