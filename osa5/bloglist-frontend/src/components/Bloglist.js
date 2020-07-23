import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  /*const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }*/

  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList