import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper
} from '@material-ui/core'

const Userlist = () => {

  const users = useSelector(state => state.userlist)

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>user</TableCell>
              <TableCell>
                blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users ? users.map(user =>
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Userlist