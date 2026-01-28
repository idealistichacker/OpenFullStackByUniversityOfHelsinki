const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

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
        .send(newBlogWithoutTitle)
        .expect(400)

    const newBlogWithoutUrl = {
        title: "HSMM",
        author: "HSMM"
    }
    await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

describe('Exercise 4.13', () => {
    test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

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