import React from 'react'

const Person = ( { person, handleDelete }) => (
    <p> 
        {person.name} {person.number}
        <button onClick={handleDelete}>delete</button>
    </p>
)

const Persons = ({ peopleToShow, handleDelete }) => (
    peopleToShow.map(person =>
        <Person 
            key={person.name} 
            person={person} 
            handleDelete={handleDelete(person)}
        />       
    )
)

export default Persons