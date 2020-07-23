import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './../reducers/userReducer'
import { Button, AppBar, Toolbar } from '@material-ui/core'

const NavigationMenu = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  //const marginRight = { marginRight: 5 }
  const marginLeft = { marginLeft: 5 }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          {user.username} logged in
          <Button
            color='inherit'
            onClick={() => dispatch(logout())}
            style={marginLeft}
          >
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>

  )
}

export default NavigationMenu