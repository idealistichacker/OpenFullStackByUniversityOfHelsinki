import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Footer from './components/Footer'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredName, setFilter] = useState('')
  const [prompt, setPrompt] = useState('Welcome')
// const hook = () => {
//   console.log('effect')
//   axios
//     .get('http://localhost:3002/persons')
//     .then(response => {
//       console.log('promise fulfilled')
//       setPersons(response.data)
//     })
// }

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filteredName.toLocaleLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.number === newNumber)){
      alert(`The number ${newNumber} was alreday in the phonebook, checkout your input!`)
    }
    else if  (persons.some(person => person.name === newName)) {
      const isUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (isUpdate){
        const updatedID = persons.find(p => p.name === newName).id
        personService
          .update(updatedID, personObject)
          .then(returnPerson => setPersons(persons.map(person => person.id === updatedID ? returnPerson : person)))
          .catch(error => {
            setPersons(persons.filter(person => person.id !== updatedID))
            setPrompt(`Information of ${newName} has already been removed from server!`)
            setTimeout(() => {
              setPrompt(null)
            }, 3000)
          })
        setPrompt(`Added ${newName}`)
        setTimeout(() => {
          setPrompt(null)
        }, 4000)
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          console.log(`%c [DEBUG] returnedPerson is ${JSON.stringify(returnedPerson)}`, 'background: #222; color: #bada55');
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setPrompt(`Added ${newName}`)
          setTimeout(() => {
            setPrompt(null)
          }, 4000)
        })
        .catch(error => {
          console.log(error.response.data)
          setPrompt(`Error: ${error.response.data.error}`)
          setTimeout(() => {
            setPrompt(null)
          }, 4000)
        })
    }
  }

  const removePerson = (id) => {
    const isDelete = window.confirm("Do you really want to delete this?");
    if (isDelete) {
      personService.remove(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={prompt} />
      {/* <div>
        filter shown with: <input value={filteredName} onChange = {handleFilterChange}></input>
      </div> */
      <Filter filteredName = {filteredName} handleFilterChange = {handleFilterChange} ></Filter>
      }
      {/* <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> */}
      <PersonForm newName = {newName} newNumber = {newNumber} addPerson = {addPerson} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      {/* <div>
        {personsToShow.map(person => <p key={person.name}>{person.name}: {person.number}</p>)}
      </div> */
      personsToShow.map(person => <Persons key = {person.id} person = {person} removePerson = {() => removePerson(person.id)}></Persons>)
      }
      <Footer></Footer>
    </div>
  )
}

export default App