const { successData, errorData } = require('../model/resModel')
const BlogService = require('../services/blog')

module.exports = {
  list: async (ctx, next) => {
    const author = ctx.query.author
    const keyword = ctx.query.keyword
    const res = await BlogService.list(author, keyword)
    ctx.body = successData(res, 'list')
  },
  detail: async (ctx, next) => {
    const id = ctx.query.id
    const res = await BlogService.detail(id)
    ctx.body = successData(res, 'detail')
  },
  new: async (ctx, next) => {
    const blogData = ctx.request.body
    const res = await BlogService.new(blogData)
    ctx.body = successData(res, 'new')
  },
  update: async (ctx, next) => {
    const id = ctx.query.id
    const blogData = ctx.request.body
    const res = await BlogService.update(id, blogData)
    ctx.body = successData(res, 'update')
  },
  delete: async (ctx, next) => {
    const id = ctx.query.id
    const author = ctx.query.author
    const res = await BlogService.delete(id, author)
    ctx.body = successData(res, 'delete')
  },
}
