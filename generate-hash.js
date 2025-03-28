const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = await scrypt(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const hash = await hashPassword("admin123");
  console.log(hash);
}

main();