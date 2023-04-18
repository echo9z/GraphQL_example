const { ApolloServer } = require('@apollo/server');
// startStandaloneServer功能使用Apollo Server 4的Express集成
const { startStandaloneServer } = require('@apollo/server/standalone')

// 1 定义schema #graphql添加到模板文字的开头，语法高亮显示。
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;
// 数据集
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// 2.定义resolvers，当查询schema，调用对应的resolvers函数
const resolvers = {
  // 所有query都走这里
  Query: {
    books: () => books,
  },
  // Mutation: {}
};

// 3.创建apolloServer实例
// ApolloServer构造函数需要两个参数: 定义schema查询规范 和 解析器集
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 传递一个ApolloServer实例给' startStandaloneServer '函数:
// 1。创建一个Express应用程序
// 2。将ApolloServer实例安装为中间件
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
})
