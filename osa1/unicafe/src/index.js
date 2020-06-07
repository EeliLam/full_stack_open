import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ text }) => <h1>{text}</h1>

//const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = ({ good, neutral, bad }) => {
  const sum = good+neutral+bad
  if (sum === 0) {
    return <div>No feedback given</div>
  }

  const avg = (good-bad)/sum
  const percentagePositive = good/sum * 100

  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{sum}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{avg}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{`${percentagePositive} %`}</td>
        </tr>
      </tbody>
    </table>

  /*<StatisticLine text="good" value={good} />
  <StatisticLine text="neutral" value={neutral} />
  <StatisticLine text="bad" value={bad} />
  <StatisticLine text="all" value={sum} />
  <StatisticLine text="average" value={avg} />
  <StatisticLine text="positive" value={`${percentagePositive} %`} />*/
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseValue = (value, setter) => {
    setter(value+1)
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => increaseValue(good, setGood)} text="good" />
      <Button handleClick={() => increaseValue(neutral, setNeutral)} text="neutral" />
      <Button handleClick={() => increaseValue(bad, setBad)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
