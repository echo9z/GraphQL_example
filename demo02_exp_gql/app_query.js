const { graphql, buildSchema } = require('graphql')
const express = require('express')
const { v4: uuidv4 } = require('uuid');
// const { graphqlHTTP } = require('express-graphql'); // graphql中间件，注意该库已被弃用
const { createHandler } = require('graphql-http/lib/use/express') // graphql-http替代express-graphql，该库已被弃用
const cors = require('cors');
const app = express()
app.use(express.static('public'))
app.use(cors()) // 运行跨域

const articles = [
  { _id: '1', title: '标题1', body: '内容' },
  { _id: '2', title: '标题1', body: '内容' },
  { _id: '3', title: '标题1', body: '内容' },
]
/**
 * schema类型
 *    参数
 *    修改
 *    输入类型
 */
// 1.使用graphql schema 语法构建一个 schema
const schema = buildSchema(`
  type Article {
    _id: ID,
    title: String!,
    body: String!,
    tagList: [String!]
  }
  # 查询类型
  type Query {
    articles: [Article],
    # 查询的参数是多个
    articleById(_id: ID!, title: String): Article # 查询参数返回的是一个Article类型对象
  }

  # 参数对象必须使用Input定义 输入参数类型
  input createArticleInput {
    title: String!,
    body: String!,
    tagList: [String!]
  }

  input updateArticleInput {
    title: String!,
    body: String!,
    tagList: [String!]
  }

  type DeletionStatus {
    success: Boolean! # 表示是否删除成功与否
  }

  # 修改类型 比如 向articles添加一个对象，或者删除一个对象
  type Mutation {
    # 如果createArticle里的参数越来越多，通过input方式定义参数
    createArticle(title: String!,body: String!): Article # 返回的是一个Article

    # 通过input 方式导入多个参数 添加一个元素
    createArticleUp(artArgs: createArticleInput): Article
    
    # 更新某个数据
    updateArticle(_id: ID!, artArgs: updateArticleInput): Article

    # 删除某个id元素对象
    deleteArticle(_id: ID!): DeletionStatus
  }
`)

// 2.定义schema的resolve 当你查询返回的结果是什么
const rootValue = {
  // 返回的数据类型，要与定义的schema 定义的类型一直，要不然会报错
  articles() {
    return articles
  },
  articleById: (args) => {// args传入的参数是 { _id: 2 }
    console.log(args);
    return articles.find(article => article._id === args._id)
  },
  createArticle(args) {
    console.log(args);
  },
  // 传入多个参数
  createArticleUp(args) {
    const { artArgs } = args
    artArgs._id = uuidv4()
    articles.push(artArgs)
    return artArgs
  },
  updateArticle(args) {
    const { _id, artArgs } = args
    const article = articles.find(item => item._id === _id)
    for (const key in artArgs) {
      article[key] = artArgs[key]
    }
    return article
  },
  // 删除某个id元素对象
  deleteArticle({ _id }) {
    const index = articles.findIndex(item => item._id === _id)
    // 删除的元素的id 是否等于 要查询删除的id
    const res = index > -1 ? articles.splice(index, 1)[0]._id === _id : false 
    console.log(articles);
    return {
      success: res
    }
  }
}

// 3.挂载中间件
app.all('/graphql', createHandler({
  schema,
  rootValue
}));

app.listen(4000, () => {
  console.log('Running server at http://localhost:4000');
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
