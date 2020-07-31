import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'
import { useApolloClient, useSubscription } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const updateCacheWith = (bookAdded) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id) 
      
    const updateBookQuery = (query, variables) => {
      const dataInStore = client.readQuery({ query, variables })
      //console.log('data', dataInStore)
      if (!includedIn(dataInStore.allBooks, bookAdded)) {
        client.writeQuery({
          query,
          variables,
          data: { allBooks : dataInStore.allBooks.concat(bookAdded) }
        })
      }   
    }

    const updateAuthorQuery = (query, variables) => {
      const dataInStore = client.readQuery({ query, variables })
      console.log('data', dataInStore)
      console.log(bookAdded)
      if (!includedIn(dataInStore.allAuthors, bookAdded.author)) {
        console.log('hi')
        client.writeQuery({
          query,
          variables,
          data: { allAuthors : dataInStore.allAuthors.concat(bookAdded.author) }
        })
      }
    }
    
    updateBookQuery(ALL_BOOKS, {})
    updateAuthorQuery(ALL_AUTHORS, {})
    //bookAdded.genres.forEach(genre => updateBookQuery(ALL_BOOKS, { genre }))
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded
      console.log('sub', subscriptionData)
      window.alert(`A new book: '${newBook.title}' by ${newBook.author.name} added`)
      //updateCacheWith(newBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const buttons = () => {
    return (
      token ?
      <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>        
      </> :
      <button onClick={() => setPage('login')}>login</button>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {buttons()}
      </div>

      <Authors
        show={page === 'authors'}
        loggedIn={token !== null}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        updateCacheWith={updateCacheWith}
      />

      <Login
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />

      <Books
        show={page === 'recommend'}
        recommend={true}
      />

    </div>
  )
}

export default App