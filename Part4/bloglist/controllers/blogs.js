const BlogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



BlogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

BlogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  //   问题出在这句的优先级：
  // await User.find({}).limit(1)[0]
  // [0] 被先应用在 查询对象 上，而不是查询结果，所以得到 undefined，随后 user._id 报错。

  // const user = await User.find({}).limit(1)[0] // 临时使用数据库中的第一个用户作为博文的作者
  // const user = await User.findOne({}) // 直接取第一条

  const blog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

  // const blog = new Blog(request.body)

  // const savedBlog = await blog.save()
  // response.status(201).json(savedBlog)
})

BlogsRouter.delete('/:id', async (request, response) => {
  const loggingUserId = request.user.id
  if (!loggingUserId) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() !== loggingUserId.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

BlogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  // 1. 等待：先去数据库把这个博客找出来
  const blog = await Blog.findById(request.params.id)

  // 2. 检查：如果找不到（比如 ID 是瞎编的），直接返回 404
  if (!blog) {
    return response.status(404).end()
  }

  // 3. 修改：既然找到了，就在内存里修改它的属性
  // (Mongoose 会在这里进行类型转换，比如把字符串 '10' 转成数字 10)
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  // 4. 等待：再次等待数据库保存操作完成
  // (这时候会触发所有 Schema 定义的验证逻辑)
  const updatedBlog = await blog.save()

  // 5. 返回：把保存后的结果发回给前端
  response.json(updatedBlog)
})

module.exports = BlogsRouter