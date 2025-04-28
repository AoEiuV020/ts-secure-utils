const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "TsSecureUtils", // 关键：将导出内容挂载到全局变量
  },
  target: "web",
};
