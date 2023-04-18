import { GraphQLError } from 'graphql';
import jwt from '../utils/jwt.mjs'
import md5 from '../utils/md5.mjs';
import config from "../config/config.default.mjs";

const resolvers = {
  Query: {
    // 查询所有文章
    articles(parent, { offset, limit }, { dataSources }) {
      // 通过Promise 进行并行发起异步操作，结构顺序按照数组的顺序进行解构结果
      // const [articles, articlesCount] = await Promise.all([
      //   // 两个数据操作，可以通过all方式进行并发请求
      //   dataSources.articles.getArticles({ offset, limit}), // 传入offset, limit进行分页处理
      //   dataSources.articles.getArticleCount()
      // ])
      // console.log(articles, articlesCount);
      // return {
      //   articles,
      //   articlesCount
      // }
      return { offset, limit } // 通过resolve解析链，将返回分页查询参数返回，下层resolve函数通过parent进行解构，示例ArticlesPayload
    }
  },
  Mutation: {
    // 创建文章
    async createArticle (parent, { article }, { dataSources, user }) { // user是通过自定指令挂载到context
      // console.log(article);
      article.author = user._id // 为文章添加用户id
      const result = await dataSources.articles.createArticle(article)
      // console.log(result);
      // 根据用户id 在数据库中查找用户数据，填充到article.author中
      return {
        article: result
      }
    }
  },
  Article: { // article中的 author字段由下面函数解析
    async author (parent, args, { dataSources }) {
      const author = await dataSources.users.findByUserId(parent.author)
      return author
    }
  },
  ArticlesPayload: {
    async articles({ offset, limit }, args, { dataSources }) {
      return await dataSources.articles.getArticles({ offset, limit})
    },
    async articlesCount(parent, args, { dataSources }) {
      return await dataSources.articles.getArticleCount()
    }
  }
};
export default resolvers