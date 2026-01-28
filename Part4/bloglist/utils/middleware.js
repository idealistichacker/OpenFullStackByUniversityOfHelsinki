const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// 可以，都用 json() 没问题。
// send() 是通用发送（可发字符串/Buffer/对象），json() 是专门返回 JSON 的语义化写法并设置 JSON 头部。这里只是风格差异。
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }else if (error.name === 'PasswordValidationError') {
  return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }else {
    // 如果没有 Token，就设为 null
    request.token = null
  }
  next()
}

// 👇 新加的：用户提取器
const userExtractor = async (request, response, next) => {
  if (request.token) {
    // 1. 如果有 token，尝试解码
    // (如果 token 是伪造的或过期的，jwt.verify 会抛出错误，
    //  会被 express-async-errors 捕获并交给 errorHandler，所以这里不用 try-catch)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    // 2. 如果解码成功且有 ID，去数据库找人
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id)
    }
  }

  // 3. 继续下一个中间件
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}