import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// 加载DataSource/users
import dataSources from './data-sources/index.mjs'
// 导入 schema 与 解析器
import schema from './schema.mjs';

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  schema: schema,
  // typeDefs,
  // resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
);
// app.use('/api', router);
app.use(
  '/graphql',
  // 将ApolloServer expressMiddleware注册，访问http://localhost:4000/graphql
  expressMiddleware(server, {
    // 任何GraphQL 请求都会经过context函数，解析器之间共享的对象
    // 函数接收一个Request请求对象
    context: async ({ req }) => {
      return {
        // req.headers.authentication 获取客户端请求头的authentication信息
        token: req.headers['authorization'],
        dataSources: dataSources
      }
    }
  }),
);

// 既有expressweb服务，又有ApolloServer服务
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);