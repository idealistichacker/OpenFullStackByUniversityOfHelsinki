const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const User = require('../models/user')

const run = async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 })

  const username = 'Todd'
  const password = 'securepassword'

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username,
    name: 'Todd',
    passwordHash
  })

  await user.save()

  const loginResponse = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const loginData = await loginResponse.json()
  console.log('token:', loginData.token)

  await mongoose.connection.close()
}

run().catch(async (err) => {
  console.error(err)
  await mongoose.connection.close()
})