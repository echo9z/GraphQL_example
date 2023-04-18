const { graphql, buildSchema } = require('graphql')
const express = require('express')
const { graphqlHTTP } = require('express-graphql'); // graphql中间件，注意该库已被弃用
const { createHandler } = require('graphql-http/lib/use/express') // graphql-http替代express-graphql，该库已被弃用
const cors = require('cors');
const app = express()
app.use(express.static('public'))
app.use(cors()) // 运行跨域

// 1.使用graphql schema 语法构建一个 schema
const schema = buildSchema(`
  type Score {
    name: String
    score: Float,
  }

  # 对象类型
  type User {
    name: String!, # 非空的
    hobby: [String]! # 非空的数组，每个元素为string
    scores: [Score] # 数组中每个元素都是一个Score分数对象
  }

  type Article {
    title: String!, # 非空的
    body: String,
    author: User, # author字段又是一个 User类型对象
  }

  # Query是一个对象类型
  # Query是所有查询的入口点
  # Query必须存在，但只能有一个
  type Query {
    # 默认情况下，每个类型返回空
    foo: String!, # 下面查询返回结果必须存在，为null抛出异常
    count: Int,
    salary: Float,
    isSay: Boolean,
    userId: ID,
    user: User, # 定义User查询对象
    article: Article,
    score: Score
  }
`)

// 2.定义schema的resolve 当你查询返回的结果是什么
const rootValue = {
  // 返回的数据类型，要与定义的schema 定义的类型一直，要不然会报错
  // foo: () => {
  //   return 'hello'
  // },
  count() {
    return 155
  },
  salary() {
    return 1025.238
  },
  userId: () => {
    return '3154541657656165'
  },
  user () {
    return {
      name: 'lili',
      hobby: ['a','console', 123],
      scores: [
        { name: 'chinese', score: 120 },
        { name: 'math', score: 110 },
        { name: 'english', score: 150 },
      ]
    }
  },
  article() {
    return {
      title: '标题',
      body: '内容',
      author: {
        name: 'zhangsan',
        hobby: ['a','console', 'asd'],
      }
    }
  },
  score() {
    return { name: 'chinese', score: 120 }
  }
}

// 3.挂载中间件
// app.all('/graphql', createHandler({
//   schema,
//   rootValue
// }));
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true // 开启浏览器 graphiql IDE调试工具
}))

app.listen(5000, () => {
  console.log('Running server at http://localhost:5000');
  console.log('Running a GraphQL API server at http://localhost:5000/graphql');
});
