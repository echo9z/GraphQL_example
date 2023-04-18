import mongoose from 'mongoose';
import config from '../config/config.default.mjs'
import users from './user.mjs'
import article from './article.mjs'

// 捕获链接数据库异常
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(config.dbUrl);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

mongoose.connection.on('open', err => {
  console.log('连接数据成功');
});
mongoose.connection.on('error', err => {
  console.log('连接数据失败');
  logError(err);
});
export default {
  users,
  article
}
// 加载user module
// export let userModule;
// export let articleModule;
// import('./user.mjs').then(userMod => {
//   userModule = userMod.default
// })
// import('./article.mjs').then(articleMod => {
//   articleModule = articleMod.default
// })
