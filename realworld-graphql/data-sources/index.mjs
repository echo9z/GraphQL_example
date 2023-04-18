import Users from './users.mjs'
import Articles from './article.mjs'

// 连接数据库，并加载user module
import module from '../models/index.mjs';
export default {
  users: new Users(module.users), // 在resolve中的 contextValue中结构users
  articles: new Articles(module.article)
  // OR
  // users: new Users(client.db().collection('users')) 这里使用的mongodb连数据库
}
