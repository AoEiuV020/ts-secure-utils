const { RSA } = require("ts-secure-utils");

const main = async () => {
  const pair = await RSA.genKeyPair();
  console.log(pair.getPublicKeyBase64());
  console.log(pair.getPrivateKeyBase64());
};

// 调用主函数
main();

// 导出main函数以便其他模块使用
module.exports = { main };
