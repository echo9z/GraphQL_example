import crypto from "crypto"

export default (str) => {
  return crypto
    .createHash("md5")
    .update(`mld` + str)
    .digest("hex");
};