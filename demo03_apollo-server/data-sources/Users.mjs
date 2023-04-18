import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Users extends MongoDataSource {
  // 通过datasource 操作数据库
  getUser(userId) {
    return this.model.findById(userId)
  }
  // 查找所有user数据
  getUsers(){
    // this.model 获取前面 DataSource配置userModel对象
    return this.model.find()
  }
}