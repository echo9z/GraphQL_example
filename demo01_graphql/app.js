const { graphql, buildSchema } = require('graphql')

// 1.使用graphql schema 语法构建一个 schema
const schema = buildSchema(`
  type Query {
    foo: String,
    count: Int
  }
`)

// 2.定义schema的resolve 当你查询foo返回的结果是什么
const rootValue = {
  // 返回的数据类型，要与定义的schema 定义的类型一直，要不然会报错
  foo: () => {
    return 'hello'
  },
  count() {
    return 155
  }
}

// 3.查询 foo 传入的对象属性必须是 { schema, source, rootValue}
graphql({
  schema, // 查询约束
  source: '{ foo, count }', // 查询语法
  rootValue // 查询返回结果
}).then(res => {
  console.log(res);
  console.log(res.data.foo);
  console.log(res.data.count);
})