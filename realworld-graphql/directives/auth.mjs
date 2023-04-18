import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import jwt from '../utils/jwt.mjs'
import config from "../config/config.default.mjs";

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
export function authDirective(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (authDirective) {
        // Get this field's original resolver
        // 是否有指定的解析器，如果没有使用graphql 默认解析器
        const { resolve = defaultFieldResolver } = fieldConfig;

        // 将原来的解析器替换为一个函数 重写resolve解析器
        fieldConfig.resolve = async function (parent, args, contextValue, info) {
          const { dataSources, token } = contextValue
          if (!token) throw new Error('not authorized')
          // 解析token 是否有效
          try {
            const verify = await jwt.verify(token, config.jwtSercret)
            const user = await dataSources.users.findByUserId(verify.userId)
            // console.log(user);
            // 把查询到的user属性 挂载到 contextValue上下文上
            contextValue.user = user
          } catch (error) {
            throw new Error('not authorized')
          }
          // 调用原来的 存放的 resolve 19行
          const result = await resolve(parent, args, contextValue, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
}