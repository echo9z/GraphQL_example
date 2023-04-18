import mongoose from 'mongoose';
// import user from './user.mjs'

// 捕获链接数据库异常
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

mongoose.connection.on('open', err => {
  console.log('连接数据成功');
});
mongoose.connection.on('error', err => {
  console.log('连接数据失败');
  logError(err);
});

// 加载user module
export let userModule;
import('./user.mjs').then(userMod => {
  userModule = userMod.default
})
