const { RSA } = require(".");
const main = async () => {
  const pair = await RSA.genKeyPair();
  console.log(pair.getPublicKeyBase64());
  console.log(pair.getPrivateKeyBase64());
};
main();
