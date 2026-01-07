import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const header = 'give feedback'

  

  const countGood = () =>{
    const newGood = good + 1
    setGood(newGood)
    setAll(newGood + neutral + bad)
    setAverage((newGood - bad) / (newGood + neutral + bad))
    setPositive((newGood * 100 / (newGood + neutral + bad)))
  }

  const countNeutral = () =>{
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setAll(good + newNeutral + bad)
    setAverage((good - bad) / (good + newNeutral + bad))
    setPositive((good * 100 / (good + newNeutral + bad)))
  }

  const countBad = () =>{
    const newBad = bad + 1
    setBad(newBad)
    setAll(good + neutral + newBad)
    setAverage((good - newBad) / (good + neutral + newBad))
    setPositive((good * 100 / (good + neutral + newBad)))
  }

  return (
    <div>
      <Header text={header} />
      <Button handleClick={countGood} text='good' />
      <Button handleClick={countNeutral} text='neutral' />
      <Button handleClick={countBad} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

const Header = ({ text }) => <h1>{text}</h1>
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>
const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return(
      <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
      </div>
    ) 
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text='good' value={good} />
          <StatisticsLine text='neutral' value={neutral} />
          <StatisticsLine text='bad' value={bad} />
          <StatisticsLine text='all' value={all} />
          <StatisticsLine text='average' value={average.toFixed(1)} />
          <StatisticsLine text='positive' value={positive.toFixed(1) + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

export default App