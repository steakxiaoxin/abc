const Koa = require('koa')
const InitApp = require('./core/init')

const app = new Koa()

InitApp.initCore(app)

app.listen(3000)
console.log('app is run on http://localhost:3000')
