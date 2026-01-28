const _ = require('lodash') // 👈 引入瑞士军刀


// 这两个练习（4.6* 和 4.7*）是很多同学在 Part 4 遇到的第一个“拦路虎”。它们带星号（*）是因为它们涉及比较复杂的**数据聚合（Data Aggregation）**逻辑。

// 如果不使用第三方库，你需要写很复杂的 reduce 逻辑。但题目提示了：“这是一个学习 Lodash 的好机会”。

// Lodash 是一个 JS 工具库，它就像是程序员的“瑞士军刀”，专门处理数组、对象和数字的复杂操作。有了它，这道题的难度直接从 Hard 降到了 Easy！

// 我们将使用 Lodash 来优雅地解决这两个问题。👩‍💻✨

// 🛠️ 第一步：安装装备 (Lodash)
// 在你的项目根目录下（part3-notes-backend 或你现在的练习目录），运行终端命令：

// Bash
// npm install lodash
// 🧱 第二步：编写功能代码 (utils/list_helper.js)
// 在你的 list_helper.js 文件顶部，先引入 Lodash。通常我们在 JS 社区里把 Lodash 简写为下划线 _。

// 1. 解决 Exercise 4.6: mostBlogs (谁是灌水王？)
// 逻辑拆解：

// 分组计数：把博客按 author 分组，算出每个作者写了多少篇。

// Lodash 工具：_.countBy

// 格式转换：把 { 'Bob': 3, 'Alice': 1 } 这种格式，转换成 { author: 'Bob', blogs: 3 } 的数组。

// Lodash 工具：_.map

// 找最大值：在数组里找出 blogs 数字最大的那个人。

// Lodash 工具：_.maxBy

// 2. 解决 Exercise 4.7: mostLikes (谁是人气王？)
// 逻辑拆解：

// 分组：先把博客按 author 分组。

// Lodash 工具：_.groupBy

// 求和：遍历每个作者的一堆博客，把它们的 likes 加起来。

// Lodash 工具：_.sumBy

// 找最大值：找出 likes 这里的最大值。

// Lodash 工具：_.maxBy

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  // 1. _.countBy 会返回一个对象，比如: { "Michael Chan": 1, "Edsger W. Dijkstra": 2 }
  const authorCounts = _.countBy(blogs, 'author')

  // 2. 我们要把这个对象转换成题目要求的格式，并找出最大的
  // _.chain 开启链式调用，让代码像流水线一样清晰
  return _.chain(authorCounts)
    .map((count, author) => ({ author: author, blogs: count })) // 转换格式
    .maxBy('blogs') // 找出 blogs 最多的那个对象
    .value() // 结束链式调用，拿到结果
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  return _.chain(blogs)
    .groupBy('author') // 1. 按作者分组: { "Bob": [blog1, blog2], "Alice": [blog3] }
    .map((authorBlogs, author) => ({ 
      author, 
      likes: _.sumBy(authorBlogs, 'likes') // 2. 算出每个作者的总赞数
    }))
    .maxBy('likes') // 3. 找出 likes 最多的那个
    .value()
}


const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sumlikes, blog) => sumlikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}