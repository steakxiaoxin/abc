module.exports = {
  configureWebpack: {
    devServer: {
      port: 3000,
      inline: true,
      hot: true,
      host: "localhost",
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          pathRewrite: { "^/api": "" }
        }
      }
    }
  }
};
