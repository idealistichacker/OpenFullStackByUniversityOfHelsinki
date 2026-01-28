
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/users')

const api = supertest(app)

// 定义一个变量存 token
let token = null 

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  // 1. 创建一个测试用户
  const passwordHash = await bcrypt.hash('securepassword', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // 2. 让这个用户登录，获取 Token
  // (这里直接发请求给 login 接口最方便)
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'securepassword' })

  // 3. 把 Token 存下来！
  token = result.body.token
})
// beforeEach(async () => {
//   await Blog.deleteMany({})

//   await Blog.insertMany(helper.initialBlogs)
// })

// beforeEach(async () => {
//   await Blog.deleteMany({})

//   const blogObjects = helper.initialBlogs
//     .map(blog => new Blog(blog))
//   const promiseArray = blogObjects.map(blog => blog.save())
//   await Promise.all(promiseArray)
// }

describe('Exercise 4.8', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')           // 模拟发送 GET 请求
            .expect(200)                 // 断言：我期待状态码是 200 OK
            .expect('Content-Type', /application\/json/) // 断言：数据格式必须是 JSON
        })
        test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })    
})

describe('Exercise 4.9', () => {
    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        
        for (const blog of blogs) {
            assert.ok(blog.id) // 断言：每个博客对象都应该有一个名为 id 的属性
        }
        // blogs.forEach(blog => {
        //     assert.ok(blog.id) // 断言：每个博客对象都应该有一个名为 id 的属性
        // })
    })
})

describe('Exercise 4.10', () => {
    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "HSM",
            author: "HSM",
            url: "https://idealistichacker.github.io/",
            likes: 7000
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


        const titles = blogsAtEnd.map(n => n.title)
        assert(titles.includes('HSM'))
    })
})

describe('Exercise 4.11', () => {
    test('default likes value is 0', async () => {
        const newBlog = {
            title: "HSMM",
            author: "HSMM",
            url: "https://idealistichacker.github.io/"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


        // 找到刚才添加的那条具体的博客（可以通过 title 找）
        const addedBlog = blogsAtEnd.find(blog => blog.title === "HSMM")
        
        // 断言这一条特定博客的 likes 是 0
        assert.strictEqual(addedBlog.likes, 0)
    })
})

describe('Exercise 4.12', () => {
    test('blog without title or url is not added', async () => {
        const newBlogWithoutTitle = {
            author: "HSMM",
            url: "https://idealistichacker.github.io/"
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutTitle)
            .expect(400)

        const newBlogWithoutUrl = {
            title: "HSMM",
            author: "HSMM"
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutUrl)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

describe('Exercise 4.13', () => {
        test('a blog can be deleted', async () => {
            // 注意：你删除的博客必须是这个 token 的拥有者创建的！
            // 所以你可能得先用上面的 token 创建一个博客，然后再删它。
            // 1. 先用当前 token 创建一个博客
            const newBlog = {
                title: "HSMM",
                author: "HSMM",
                url: "https://idealistichacker.github.io/"
            }
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)

            const blogToDelete = response.body

            // 2. 然后删除它，带上同一个 token
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`) // 👈 记得带 Token
                .expect(204)
            // const blogsAtStart = await helper.blogsInDb()
            // const blogToDelete = blogsAtStart[0]

            // await api
            //     .delete(`/api/blogs/${blogToDelete.id}`)
            //     .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

            const titles = blogsAtEnd.map(r => r.title)
            assert.ok(!titles.includes(blogToDelete.title))
    })
})

describe('Exercise 4.14', () => {
    test('update likes of a blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            ...blogToUpdate, // 复制原有属性
            likes: blogToUpdate.likes + 10 // 修改 likes
        }

        const result = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200) // 期待成功

        // 验证返回的结果是不是等于我们发过去的数据
        assert.strictEqual(result.body.likes, blogToUpdate.likes + 10)
    })
})

after(async () => {
await mongoose.connection.close()
})