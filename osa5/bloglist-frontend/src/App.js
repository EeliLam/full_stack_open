import React, { useEffect, useRef } from 'react'
import { updateBlogs } from './reducers/blogReducer'
import { loginUserFromLocalStorage } from './reducers/userReducer'
import { getAllUsers } from './reducers/userlistReducer'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/Bloglist'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Userlist from './components/Userlist'
import User from './components/User'
import NavigationMenu from './components/NavigationMenu'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Container from '@material-ui/core/Container'

const App = () => {

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const allUsers = useSelector(state => state.userlist)

  const dispatch = useDispatch()

  const createBlogFormRef = useRef()

  useEffect(() => {
    const update = () => dispatch(updateBlogs()) // To get rid of implicit promise return
    update()
  }, [dispatch])

  useEffect(() => {
    const login = () => dispatch(loginUserFromLocalStorage()) // Same here
    login()
  }, [dispatch])

  useEffect(() => {
    const getUsers = () => dispatch(getAllUsers())
    getUsers()
  }, [dispatch])

  const loginForm = () => (
    <div>
      <Notification />
      <LoginForm/>
    </div>
  )

  const loggedIn = () => (
    <Router>
      <NavigationMenu/>
      <Notification />
      <h2>Blog app</h2>
      <Switch>
        <Route path='/blogs/:id'>
          <Blog blogs={blogs} />
        </Route>
        <Route path='/users/:id'>
          <User users={allUsers}/>
        </Route>
        <Route path='/users'>
          <Userlist></Userlist>
        </Route>
        <Route path='/'>
          <Togglable buttonLabel='new blog' ref={createBlogFormRef}>
            <CreateBlogForm toggleRef={createBlogFormRef}/>
          </Togglable>
          <BlogList/>
        </Route>
      </Switch>
    </Router>
  )

  return (
    <Container>
      {user === null ? loginForm() : loggedIn()}
    </Container>
  )
}

export default App