const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8, // 规则1：总长度限制（Mongoose 原生支持，不需要写正则里）
    required: true,
    validate: {
      // 👇 这里的 v 就是前端传过来的号码字符串
      validator: function(v) {
        // test() 是正则的方法，符合返回 true，不符合返回 false
        return /^\d{2,3}-\d+$/.test(v);
      },
      // 👇 验证失败时返回给前端的消息
      message: props => `${props.value} 不是一个合法的电话号码！格式应为 09-1234567 或 040-1234567`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)