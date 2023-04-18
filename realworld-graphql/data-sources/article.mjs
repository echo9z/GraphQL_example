import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Articles extends MongoDataSource {
  // 通过datasource 操作数据库
  createArticle(data) {
    const article = new this.model(data)
    // article.populate('author').exec()
    return article.save() // 将数据进行保存
  }
  getArticleById(articleID) {
    return this.model.findById(articleID)
  }

  getArticles(option) {
    // skip跳过offset页，比如传入1 跳过第一页，即从第一页开始
    return this.model.find().skip(option.offset).limit(option.limit)
  }
  getArticleCount() {
    return this.model.countDocuments()
  }
}