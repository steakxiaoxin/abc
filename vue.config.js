module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      port: 3001,
      inline: true,
      hot: true,
      host: "localhost",
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          pathRewrite: { "^/api": "" }
        }
      }
    }
  }
};
