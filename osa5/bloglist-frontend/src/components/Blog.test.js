import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import CreateBlogForm from './CreateBlogForm'

describe('<Blog />', () => {
  let component
  let mockHandler

  beforeEach(() => {
    const user = {
      name: 'myName',
      username: 'myUser',
      id: 'myId'
    }

    const blog = {
      title: 'myTitle',
      author: 'myAuthor',
      url: 'myUrl',
      likes: 0,
      user
    }

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} addLike={mockHandler} />
    )
  })

  test('Initially renders title and author, but not likes and url', () => {

    const partialInfo = component.container.querySelector('#partialInfo')
    const fullInfo = component.container.querySelector('#fullInfo')

    expect(partialInfo).toHaveTextContent('myTitle')
    expect(partialInfo).toHaveTextContent('myAuthor')
    expect(partialInfo).not.toHaveTextContent('myUrl')
    expect(partialInfo).not.toHaveTextContent('0')

    expect(fullInfo).toHaveStyle('display: none')
  })

  test('After clicking the view button renders also likes and url', () => {

    const button = component.getByText('view')
    fireEvent.click(button)

    const fullInfo = component.container.querySelector('#fullInfo')

    expect(fullInfo).toHaveTextContent('myTitle')
    expect(fullInfo).toHaveTextContent('myAuthor')
    expect(fullInfo).toHaveTextContent('myUrl')
    expect(fullInfo).toHaveTextContent('0')
    expect(fullInfo).not.toHaveStyle('display: none')
  })

  test('Calls event handler twice with two clicks to the like button', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})

describe('<CreateBlogForm />', () => {
  test('Calls handler function with correct parameters on submit', () => {

    const mockHandler = jest.fn()
    const component = render(
      <CreateBlogForm createBlog={mockHandler} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'testTitle' }
    })
    fireEvent.change(author, {
      target: { value: 'testAuthor' }
    })
    fireEvent.change(url, {
      target: { value: 'testUrl' }
    })
    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual(
      {
        title: 'testTitle',
        author: 'testAuthor',
        url: 'testUrl'
      }
    )
  })
})