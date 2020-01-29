const router = require('koa-router')()
const UserController = require('../controllers/user')

router.post('/api/user/login', UserController.login)

module.exports = router
