import React from 'react'
import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name}</h1>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>

            <h2>Spoken languages</h2>
            <ul>
                {country.languages.map(language =>
                    <li key={language.name}>{language.name}</li>)}
            </ul>
            <img 
                src={country.flag} 
                style={{width:"150px",height:"100px"}}
                alt="Flag of the country"
            />

            <Weather country={country} />
        </div>
    )
}

const CountryList = ( { countries, setNewInput }) => {

    const handleClick = (country) => {
        return () => setNewInput(country.name)
    }

    return (
        <div>
            {countries.map(country =>
                <div 
                    key={country.name}>{country.name}
                    <button onClick={handleClick(country)}>show</button>
                </div>
                )}
        </div>
    )
}

const CountryData = ({ newInput, data, setNewInput }) => {
    const countriesToShow = data.filter(country => 
        country.name.toLowerCase().includes(newInput.toLowerCase()))

    const n = countriesToShow.length
    
    if (n > 10) {
        return <div>Too many matches, specify another filter</div>
    } else if (n > 1) {
        return <CountryList 
                    countries={countriesToShow}
                    setNewInput={setNewInput}
                />
    } else if (n === 1) {
        return <Country country={countriesToShow[0]} />
    }

    return <div></div>
}

export default CountryData