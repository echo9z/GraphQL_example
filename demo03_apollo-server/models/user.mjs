import mongoose from 'mongoose';
const { Schema } = mongoose;

// mongooses 数据库中user Schema
const userSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  age: Number,
});

// 导出用户模型
export default mongoose.model('User', userSchema)