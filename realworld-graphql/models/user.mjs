import mongoose from 'mongoose';
import baseModel from './base-model.mjs';
import md5 from "../utils/md5.mjs";
const { Schema } = mongoose;

// mongooses 数据库中user Schema
const userSchema = new Schema({
  ...baseModel,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (value) => md5(value), // 将密码通过md5处理
    // select: false,
  },
  bio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
});

// 导出用户模型
export default mongoose.model('User', userSchema)


