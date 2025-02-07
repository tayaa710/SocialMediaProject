const usersRouter = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).select("-passwordHash")
  response.json(users)
})

usersRouter.post("/", async (request, response) => {
  const { password, ...body } = request.body
  if (!password) {
    return response.status(400).json({ error: "password required" })
  }

  if (password.length < 5) {
    return response.status(400).json({ error: "password must be at least 5 characters" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    ...body, passwordHash
  })

  const savedUser = await user.save()
  return response.status(201).json(savedUser)
})

module.exports = usersRouter