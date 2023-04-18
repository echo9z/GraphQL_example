const typeDefs = `#graphql
  # Definition @定义自定义指令名称 on 在属性对象上或者object对象上使用
  directive @upper on FIELD_DEFINITION # FIELD_DEFINITION在属性上使用
  directive @auth on FIELD_DEFINITION

  type User {
    email: String!
    newField: String
    username: String! @deprecated(reason: "Use newField.") @upper
    token: String
    bio: String
    image: String
    following: Boolean # 关注
  }
  # 返回数据通过 user: { }
  type UserPayload {
    user: User
  }
  # 登录参数
  input LoginInput {
    email: String!
    password: String!
  }
  # 注册
  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }
  input UpdateInput {
    email: String
    username: String
    password: String
    bio: String
    image: String
  }

  # article
  type Article {
    _id: ID!
    title: String!
    description: String!
    body: String!
    tagList: [String!]
    createdAt: String!
    updatedAt: String!
    favorited: Boolean # 是否收藏
    favoritesCount: Int
    author: User
  }
  type CreateArticlePayload{
    article: Article
  }
  input CreateArticleInput {
    title: String!
    description: String!
    body: String!
    tagList: [String!]
  }
  type ArticlesPayload {
    articles: [Article!]
    articlesCount: Int!
  }

  type Mutation {
    register(user: RegisterInput): UserPayload # /users 注册用户
    updateUser(user: UpdateInput): UserPayload @auth

    # article
    createArticle(article: CreateArticleInput): CreateArticlePayload @auth # 添加认证
  }
  # 形成链式关系
  type Query {
    login(user: LoginInput): UserPayload # /users/login
    currentUser: UserPayload @auth # /user
    # 分页查询 offset页面，limit条数
    articles(offset: Int = 0, limit: Int = 10): ArticlesPayload
  }
`;

export default typeDefs