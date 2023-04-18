import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// The GraphQL schema
const typeDefs = `#graphql
  # 定义user类型
  type User {
    id: ID!
    name: String
  }
  type Query {
    numberSix: Int! # Should always return the number 6 when queried
    numberSeven: Int! # Should always return 7
    # 根据id 查询user用户
    user(id: ID!): User
  }
`;
const users = [
  { id: '1', name: 'Elizabeth Bennet',
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
  },
];
// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    numberSix() {
      return 6;
    },
    numberSeven() {
      return 7;
    },
    // resolver中的args参数对象，客户提交的参数
    user(parent, args, contextValue, info) {
      console.log(args);
      return users.find((user) => user.id === args.id);
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
  expressMiddleware(server), // 将 ApolloServer 和 express结合
);

app.use('/home',(req,res) => {
  res.status(200)
  res.send('hello')
  res.end()
})

// 既有expressweb服务，又有ApolloServer服务
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);