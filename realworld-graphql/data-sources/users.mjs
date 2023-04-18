import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Users extends MongoDataSource {
  findByUserId(userId) {
    // 查询MongoDB
    return this.model.findById(userId)
  }
  // 通过datasource 操作数据库
  findByEmail(email) {
    // 查询MongoDB
    return this.model.findOne({ email })
  }
  findByUsername (username) {
    return this.model.findOne({ username })
  }
  // 查找所有user数据
  async createUsers(user){
    // this.model 获取前面 DataSource配置userModel对象
    const userDoc = new this.model(user) // 模型的实例称为文档。创建它们并保存到数据库 new User() new一个model实例
    return userDoc.save();
  }
  updateUser (userId, data) {
    return this.model.findOneAndUpdate(
      { _id: userId }, // 查询
      data,
      { new: true } // 返回结果为最新的数据
    )
  }
}