import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// 连接数据库，并加载user module
import { userModule } from './models/index.mjs';
// 加载DataSource/users
import UserSource from './data-sources/Users.mjs'

// The GraphQL schema
const typeDefs = `#graphql
  # 形成链式关系
  type User {
    _id: ID,
    name: String!
    age: Int
  }

  type Query {
    users: [User!]
    user(id: ID!): User
  }
`;

// 解析器
const resolvers = {
  Query: {
    async users(parent, args, contextValue){
      // 查询mongodb 中users，返回结果要符合 schema规范
      const users = await contextValue.dataSources.users.getUsers()
      return users;
    },
    async user(parent, args, contextValue) {
      const user = await contextValue.dataSources.users.getUser(args.id)
      return user
    }
  },
};

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
);

app.use(
  '/graphql',
  // 将ApolloServer expressMiddleware注册，访问http://localhost:4000/graphql
  expressMiddleware(server, {
    // 任何GraphQL 请求都会进过这个context函数，解析器之间共享的对象
    // 函数接收一个Request请求对象
    context: async ({ req }) => ({
      // req.headers.authentication 获取客户端请求头的authentication信息
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      headers: req.headers['content-type'], // req.headers.token
      dataSources: {
        users: new UserSource(userModule) // 在resolve中的 contextValue中结构users
        // OR
        // users: new Users(client.db().collection('users')) 这里使用的mongodb连数据库
      }
    }),
  }),
);

// 既有expressweb服务，又有ApolloServer服务
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);