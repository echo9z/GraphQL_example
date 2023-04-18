import jwt from "jsonwebtoken";
// import config from "../config/config.default.mjs";

import { promisify } from 'util'

export const sign = promisify(jwt.sign)

export const verify = promisify(jwt.verify)

export const decode = promisify(jwt.decode)
export default {
  sign,
  verify,
  decode
}
//生成jwt
// export const sign = (payload) => {
//   return new Promise((resolve, reject) => {
//     jwt.sign(
//       payload,
//       config.jwtSercret,
//       //   {
//       //     expiresIn: 30,
//       //   },
//       (err, token) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(token);
//       }
//     );
//   });
// };

// //验证jwt
// export const verify = (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, config.jwtSercret, (err, res) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(res);
//     });
//   });
// };