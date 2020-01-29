const router = require('koa-router')()
const BlogController = require('../controllers/blog')

router.get('/api/blog/list', BlogController.list)
router.get('/api/blog/detail', BlogController.detail)
router.post('/api/blog/new', BlogController.new)
router.post('/api/blog/update', BlogController.update)
router.post('/api/blog/delete', BlogController.delete)

module.exports = router
