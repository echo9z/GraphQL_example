import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from "./type-defs/index.mjs";
import resolvers from "./resolvers/index.mjs";
import { upperDirectiveTransformer } from "./directives/upper.mjs"
import { authDirective } from "./directives/auth.mjs"


// 导出 schema 与resolvers
let schema = makeExecutableSchema({
  typeDefs,
  resolvers, // 多个resolve [resolve1,resolve2]
})

// Transform the schema by applying directive logic
schema = upperDirectiveTransformer(schema, 'upper');
schema = authDirective(schema, 'auth')
export default schema