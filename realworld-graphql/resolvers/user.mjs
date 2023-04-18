import { GraphQLError } from 'graphql';
import jwt from '../utils/jwt.mjs'
import md5 from '../utils/md5.mjs';
import config from "../config/config.default.mjs";

const resolvers = {
  Query: {
    async login(parent, { user }, { dataSources }) {
      const users = dataSources.users
      // 判断邮箱是否存在
      const userResult = await users.findByEmail(user.email)
      if (!userResult) throw new GraphQLError('邮箱不存在', {
        extensions: {
          code: 'FORBIDDEN',
        },
      })
      // console.log(userResult);
      // 密码是否正确
      if(md5(user.password) !== userResult.password) throw new GraphQLError('密码不一致在')
      const token = await jwt.sign(
        { userId: userResult._id, username: userResult.username },
        config.jwtSercret, 
        { expiresIn: 60 * 60 * 24 })
      return {
        user: {
          ...userResult.toObject(),
          token
        }
      }
    },
    async currentUser(parent, args, contextValue) {
      // 指定指令的
      const user = contextValue.user
      const token = await jwt.sign(
        { userId: user._id, username: user.username },
        config.jwtSercret, 
        { expiresIn: 60 * 60 * 24 })
      return {
        user: {
          ...user.toObject(),
          token
        }
      }
      // const { dataSources, token } = contextValue
      // const users = dataSources.users
      /* try {
        // 验证token是否有效，以及登录状态
        const verify = await jwt.verify(token, config.jwtSercret)
        if(verify) {
          const user = await users.findByUserId(verify.userId)
          const token = await jwt.sign(
            { userId: users._id, username: users.username },
            config.jwtSercret, 
            { expiresIn: 60 * 60 * 24 })
          return {
            user: {
              ...user.toObject(),
              token
            }
          }
        }
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error.message + '身份验证失败', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      } */
    }
  },
  Mutation: {
    // 注册用户
    async register(parent, { user }, { dataSources }) {
      // console.log(user);
      const users = dataSources.users
      // 判断邮箱是否存在
      const emailResult = await users.findByEmail(user.email)
      if (emailResult) throw new GraphQLError('邮箱已存在', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      })
      // 判断用户是否存在
      const usernameResult = await users.findByEmail(user.username)
      if (usernameResult) throw new GraphQLError('用户已存在')
      // 保存用户
      const userData = await users.createUsers(user)
      const token = await jwt.sign(
        { userId: userData._id, username: userData.username },
        config.jwtSercret, 
        { expiresIn: 60 * 60 * 24 })
      // 生成token
      return {
        user: {
          ...userData.toObject(), // 转换为toObject 对象
          token,
        }
      }
    },
    // 更新
    async updateUser(parent, { user: userInput }, { dataSources, user }) {
      if (userInput.password) userInput.password = md5(userInput.password)
      const result = await dataSources.users.updateUser(user._id, userInput)
      return {
        user: {
          ...result.toObject()
        }
      }
    },
  }
};
export default resolvers