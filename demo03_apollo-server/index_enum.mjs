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
  type Product {
    id: ID!
    name: String
    variants: [String!]
    availability: Availability!
  }

  # 枚举类型
  enum Availability {
    AVAILABLE
    DISCONTINUED
  }
  type Query {
    products: [Product]
    getAvailability(ava: Availability!): Product
  }
`;
const products = [
  { id: '1', name: '苹果', variants: ['a','b'], availability: 'AVAILABLE' },
  { id: '2', name: '句子', variants: ['a','b'], availability: 'DISCONTINUED' },
];
// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    products() {
      return products
    },
    getAvailability(parent, args, contextValue, info) {
      console.log(args);
      return products.find(item => item.availability === args.ava)
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

// 既有expressweb服务，又有ApolloServer服务
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);