require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// app.use(express.static('dist'))

// 1. 定义一个叫 'body' 的新 token
// 这里的 req 就是请求对象，我们需要把它里面的 body 拿出来
morgan.token('body', (req) => {
  // ⚠️ 重点知识点：
  // req.body 是个 JS 对象，直接打印会显示 [object Object] 看不到内容
  // 必须用 JSON.stringify() 把它转成字符串！
  return JSON.stringify(req.body)
})

// 2. 使用自定义格式
// 前面的 ':method :url...' 这一长串其实就是 'tiny' 的展开版
// 我们只是在最后面拼了一个我们刚造的 ':body'
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.json())

// let persons = [
//     {
//       id: "1",
//       name: "Arto Hellas",
//       number: "040-123456"
//     },
//     {
//       id: "2",
//       name: "Ada Lovelace",
//       number: "39-44-5323523"
//     },
//     {
//       id: "3",
//       name: "Dan Abramov",
//       number: "12-43-234345"
//     },
//     {
//       id: "4",
//       name: "Mary Poppendieck",
//       number: "39-23-6423122"
//     }
// ]


app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phone book has info for ${persons.length} people</p> <p>${new Date()}</p>`)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
      // Successfully deleted
        console.log('Deleted person:', result.name)
        response.status(204).end()
      }
      else {
      // Person not found
        response.status(404).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const randomId = Math.floor(Math.random() * 100000000)
//   return String(randomId)
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  // if (persons.find(person => person.name === body.name)){
  //   return response.status(400).json({
  //       error: `${body.name} is already added to phonebook`
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})