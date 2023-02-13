const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: ["index.html"],
    }),
  ],
  devServer: {
    allowedHosts: "all",
    static: "./",
  },
};
