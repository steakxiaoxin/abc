const { successData, errorData } = require('../model/resModel')
const UserService = require('../services/user')

module.exports = {
  login: async (ctx, next) => {
    const { username, password } = ctx.request.body
    const res = await UserService.login(username, password)
    if (res.username) {
      ctx.cookies.set('username', res.username, { path: '/', httpOnly: true })
      ctx.body = successData(res, 'login')
    } else {
      ctx.body = errorData('登录失败')
    }
  },
}
