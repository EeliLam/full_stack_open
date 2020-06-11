import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Input from './components/Input'
import CountryData from './components/CountryData'

const App = () => {
  const [newInput, setNewInput] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
         .then(response => setData(response.data))
  }, [])

  const handleInputChange = (event) => (
    setNewInput(event.target.value)
  )

  return (
  <div>
    <Input 
      handleInputChange={handleInputChange}
      newInput={newInput} 
    />
    <CountryData
      newInput={newInput}
      data={data}
      setNewInput={setNewInput}
    />
  </div>
)}

export default App;
