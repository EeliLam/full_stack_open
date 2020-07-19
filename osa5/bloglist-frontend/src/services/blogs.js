import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log('getall', response.data)
  return response.data
}

const postNew = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const modifyBlog = async (id, newBlogObject) => {
  const config = {
    headers: { Authorization: token }
  }
  console.log(newBlogObject)

  const url = `${baseUrl}/${id}`
  const response = await axios.put(url, newBlogObject, config)
  console.log('response', response.data)
  return response.data
}

const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, postNew, setToken, modifyBlog, deleteBlog }