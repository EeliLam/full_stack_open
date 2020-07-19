import React, { useState, useEffect, useRef } from 'react'
import { setNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/Bloglist'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  const blogs = useSelector(state => state.blogs)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //const [notification, setNotification] = useState(null)
  //const [isError, setIsError] = useState(false)

  const dispatch = useDispatch()

  const createBlogFormRef = useRef()

  const updateBlogs = () => {
    blogService
      .getAll()
      .then(response => setBlogs(response))
  }

  useEffect(() => updateBlogs(), [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  /*const displayNotification = ({ msg, error }) => {
    setNotification(msg)
    setIsError(error)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }*/

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      console.log('logging in with', username, password)
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotification(`${user.username} logged in`, false, 3))
    } catch(exception) {
      console.log('exception:', exception)
      dispatch(setNotification('Wrong username/password', true, 3))
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const createBlog = async (blogObject) => {
    createBlogFormRef.current.toggleVisibility()

    try {
      console.log('Creating new blog')
      await blogService.postNew(blogObject)

      updateBlogs()

      dispatch(setNotification(`A new blog: ${blogObject.title} by ${blogObject.author} added`, false, 3))

    } catch(exception) {
      console.log('exception:', exception)
    }

  }

  const addLikeTo = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes+1 }
    console.log('all blogs', blogs)
    console.log('addliketo', changedBlog)

    try {
      const returnedBlog = await blogService.modifyBlog(id, changedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch(exception) {
      console.log('exception', exception)
    }
  }

  const removeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }
    } catch(exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
    />
  )

  const loggedIn = () => (
    <div>
      <h2>Current user</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new blog' ref={createBlogFormRef}>
        <CreateBlogForm createBlog={createBlog}/>
      </Togglable>
      <BlogList
        blogs={blogs}
        addLikeTo={addLikeTo}
        removeBlog={removeBlog}
        currentUsername={user.username}/>
    </div>
  )

  return (
    <div>
      <Notification error={false} />
      {user === null ? loginForm() : loggedIn()}
    </div>
  )
}

export default App