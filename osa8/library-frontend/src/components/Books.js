import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from './../queries'

const Books = (props) => {
  const allBooksQuery = useQuery(ALL_BOOKS)
  const [ getBooks, bookQueryResult ]  = useLazyQuery(ALL_BOOKS)
  const currentUserQuery = useQuery(CURRENT_USER)
  const [filter, setFilter] = useState('')
  const [allGenres, setAllGenres] = useState([])

  const books = useRef(null)
  const favoriteGenre = useRef(null)

  const getBooksByGenre = (genre) => {
    getBooks({ variables: { genre: filter } })
  }

  useEffect(() => {
    if (allBooksQuery.data && !props.recommend) {
      books.current = allBooksQuery.data.allBooks
    }
  }, [allBooksQuery.data]) //eslint-disable-line

  useEffect(() => {
    if (bookQueryResult.data) {
      books.current = bookQueryResult.data.allBooks
      const allGenres_ = []
      books.current.forEach(book => {
        book.genres.forEach(genre => {
          if (!allGenres_.includes(genre)) {
            allGenres_.push(genre)
          }
        })
      })
      setAllGenres(allGenres_)
    }
  }, [bookQueryResult.data])

  useEffect(() => {
    if (filter && filter !== '') {
      getBooksByGenre(filter)
    } else {
      getBooks()
    }
  }, [filter]) //eslint-disable-line

  useEffect(() => {
    if (currentUserQuery.data) {
      favoriteGenre.current = currentUserQuery.data.me.favoriteGenre
      if (props.recommend) {
        setFilter(favoriteGenre.current)
      }
    }
  }, [currentUserQuery.data]) //eslint-disable-line

  if (!props.show) {
    return null
  }

  if (allBooksQuery.loading || currentUserQuery.loading) {
    return <div>loading...</div>
  }

  const genreButtons = () => {
    return (
      <div>
        {allGenres.map(genre => (
          <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
        ))}
        <button onClick={() => setFilter('')}>all genres</button>
      </div>
      
    )
  }

  return (
    <div>
      {props.recommend ? 
        <div>
          <h2>
            recommendations
          </h2>
          <div>
            books in your favorite genre
            <span style={{fontWeight: 'bold'}}>{` ${filter}`}</span>
          </div>
        </div> :
        <h2>books</h2>}

      {props.recommend || filter === '' ? null : 
        <div>
          in genre
          <span style={{fontWeight: 'bold'}}>{` ${filter}`}</span>
        </div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.current.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      {props.recommend ? null : genreButtons()}

    </div>
  )
}

export default Books