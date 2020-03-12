require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// Logging post and put received input data
morgan.token('postRequest', function(req, res) {
  if(req.method === 'POST' || req.method === 'PUT')
    return JSON.stringify(req.body)
  else
    return ' '
})

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postRequest'))

// Root web access
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Handling not found endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Endpoint not found' })
}

// Using not defined endpoint
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if(error.name === 'ValidationError'){
    return response.status(400).json({'error': error.message})
  }

  next(error)
}

app.use(errorHandler)

// Listener
const PORT = process.env.PORT || 9292
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})