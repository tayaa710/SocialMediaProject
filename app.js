//Utility imports 
const config = require("./utils/config")
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

//Setting up express
const express = require("express")
const app = express()

//Importing routers
const usersRouter = require('./controllers/users')

//Other Packages
require('express-async-errors')
const cors = require('cors')

//Mongoose Set up and connection
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

//Middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)


// Error middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app