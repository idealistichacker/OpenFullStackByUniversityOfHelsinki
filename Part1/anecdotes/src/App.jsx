import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  let maxVote = Math.max(...votes)
  let maxIndex = votes.indexOf(maxVote)

  const clickButtonOnRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const voteAnecdotes = () => {
    const copyVotes = [...votes]
    copyVotes[selected] += 1
    // console.log(`current votes for ${anecdotes[selected]}`, copyVotes)
    // console.log('%c [DEBUG] ', 'background: #222; color: #bada55', anecdotes[selected],'的票数为:', copyVotes[selected]);
    console.log(`%c [DEBUG] ${anecdotes[selected]}的票数为${copyVotes[selected]}`, 'background: #222; color: #bada55');
    setVotes(copyVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]} 
        <br></br>Has {votes[selected]} votes.  
      </p>
      <button onClick={voteAnecdotes}>vote</button>
      <button onClick={clickButtonOnRandomAnecdote}>Next Anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxIndex]}</p>
    </div>
  )
}

export default App