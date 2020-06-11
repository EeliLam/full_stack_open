import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

const App = () => {
    const [persons, setPersons] = useState([])

    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ newFilter, setNewFilter ] = useState('')

    const [ notification, setNotification ] = useState(null)
    const [ isError, setIsError ] = useState(true)

    useEffect(() => {
        personService
            .getAll()
            .then(updated => setPersons(updated))
    }, [])

    const addPerson = () => {
        const newPerson = {
            name: newName,
            number: newNumber
        }
        personService
            .create(newPerson)
            .then(person => {
                setPersons(persons.concat(person))
                setNewName('')
                setNewNumber('')
                setNotification(`Added ${newName}`)
                setIsError(false)
                setTimeout(() => setNotification(null), 3000)
            })
    }

    const updatePerson = () => {
        const personToUpdate = persons.find(p => p.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber}
        personService
            .update(updatedPerson)
            .then(person => {
                setPersons(persons.map(p => 
                    p.id === personToUpdate.id ? person : p
                ))
                setNewName('')
                setNewNumber('')
                setNotification(`Updated number for ${newName}`)
                setIsError(false)
                setTimeout(() => setNotification(null), 3000)
            })
            .catch(error => {
                setNotification(
                    `Information of ${newName} has already been removed from server`
                )
                setIsError(true)
                setTimeout(() => setNotification(null), 3000)
                setPersons(persons.filter(p => p.id !== personToUpdate.id))
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        
        if (persons.map(person => person.name).includes(newName)) {
            const msg = `${newName} is already added to phonebook, replace the old number with a new one?`
            if (window.confirm(msg)) {
                updatePerson()
            }
        } else {
            addPerson()
        }
    }

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleDelete = person => {
        return (() => {
            if (window.confirm(`Delete ${person.name} ?`)) {
                personService
                    .remove(person.id)
                    .then(() => {
                        setPersons(persons.filter(p => p.id !== person.id))
                        setNotification(`Removed ${person.name}`)
                        setIsError(false)
                        setTimeout(() => setNotification(null), 3000)
                    })
                    
            }
        })
    }

    const peopleToShow = persons.filter(person => {
        return person.name.toLowerCase().slice(0,newFilter.length) === newFilter.toLowerCase()
    })
  
    return (
      <div>
        <h2>Phonebook</h2>
        <Notification msg={notification} error={isError} />
        <Filter 
            handleFilterChange={handleFilterChange} 
            newFilter={newFilter} 
        />
        <h3>Add a new</h3>
        <PersonForm 
            handleSubmit={handleSubmit}
            handleNameChange={handleNameChange}
            newName={newName}
            handleNumberChange={handleNumberChange}
            newNumber={newNumber}
        />
        <h3>Numbers</h3>
        <Persons peopleToShow={peopleToShow} handleDelete={handleDelete} />
      </div>
    )
  
  }
  
  export default App