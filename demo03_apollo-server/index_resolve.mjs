import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// The GraphQL schema
const typeDefs = `#graphql
  # 形成链式关系
  type Library {
    branch: String!
    books: [Book!]
  }

  type Book {
    title: String!
    author: Author!
  }

  type Author {
    name: String!
  }

  type Query {
    libraries: [Library]
  }
`;

/**
 * 使用下面的查询语句，执行顺序
 * Query.libraries() => Library.books() => Book.author() => Author.name()
query GetBooksByLibrary {
  libraries {
    books {
      author {
        name
      }
    }
  }
}
 */

const libraries = [
  { branch: 'downtown', },
  { branch: 'riverside', },
];

const books = [
  { title: 'The Awakening', author: 'Kate Chopin', branch: 'riverside',},
  { title: 'City of Glass', author: 'Paul Auster', branch: 'downtown', },
];

// 解析器
const resolvers = {
  Query: {
    libraries(parent, args, contextValue){
      console.log(contextValue);
      return libraries;
    },
  },
  Library: {
    // parent 上一步解析结果，通过父参数传递给下一个解析器
    // parent就是libraries()查询得到的图书对象数组，在于book数组中的branch进行过滤
    books(parent, args, contextValue) {
      console.log(parent);
      console.log(contextValue);
      return books.filter(book => book.branch === parent.branch)
    }
  },
  Book: {
    // 返回过滤后的books数组中每一个对象
    author(parent) {
      console.log(parent);
      console.log('-----------------');
      return { // 返回author schema对象
        name: parent.author,
      };
    }
  }
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
      headers: req.headers['content-type'] // req.headers.token
    }),
  }),
);

// 既有expressweb服务，又有ApolloServer服务
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);