import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
    const [weatherData, setWeatherData] = useState([])

    useEffect(() => {
        const api_key = process.env.REACT_APP_API_KEY
        const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`
        axios
            .get(url)
            .then(response => setWeatherData(response.data))
    }, [country.capital])

    return (
        <div>
            <h2>Weather in {country.capital}</h2>
            <h3>temperature: {weatherData.current && weatherData.current.temperature} Celsius</h3>
            <img
                src={weatherData.current && weatherData.current.weather_icons[0]}
                style={{width:"50px",height:"50px"}}
                alt="Weather icon"
            />
            <h3>
                wind: {weatherData.current && weatherData.current.wind_speed} kph
                direction {weatherData.current && weatherData.current.wind_dir}
            </h3>
        </div>
    )
}

export default Weather