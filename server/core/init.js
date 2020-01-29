const Router = require('koa-router')
const requireDirectory = require('require-directory')
const bodyParser = require('koa-bodyparser')

class InitApp {
  static initCore(app) {
    InitApp.app = app
    InitApp.app.use(bodyParser())

    InitApp.initRouters()
  }
  static initRouters() {
    //module为固定参数，'./routes'为路由文件所在的路径(支持嵌套目录下的文件)，第三个参数中的visit为回调函数
    const modules = requireDirectory(module, `${process.cwd()}/server/routes`, {
      visit: obj => {
        if (obj instanceof Router) {
          InitApp.app.use(obj.routes())
        }
      },
    })
  }
}

module.exports = InitApp
